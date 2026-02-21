const User = require('../models/User');

const proficiencyScore = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3
};

const calculateSkillMatch = (userSkills, requiredSkills) => {
  let matchScore = 0;
  let totalRequired = requiredSkills.length;
  
  requiredSkills.forEach(req => {
    const normalizedReqSkill = req.skill.toLowerCase().replace(/\s+/g, '');
    const userSkill = userSkills.find(s => 
      s.name.toLowerCase().replace(/\s+/g, '') === normalizedReqSkill
    );
    if (userSkill && proficiencyScore[userSkill.proficiency] >= proficiencyScore[req.minProficiency]) {
      matchScore += proficiencyScore[userSkill.proficiency];
    }
  });
  
  return totalRequired > 0 ? matchScore / (totalRequired * 3) : 0;
};

const calculateExperienceScore = (user) => {
  const experienceCount = user.profile.workExperience?.length || 0;
  return Math.min(experienceCount / 5, 1);
};

const calculateFairnessPenalty = (selectionFrequency) => {
  return Math.exp(-selectionFrequency / 10);
};

const calculateWorkloadPenalty = (activeProjectCount) => {
  if (activeProjectCount === 0) return 1;
  if (activeProjectCount === 1) return 0.8;
  if (activeProjectCount === 2) return 0.5;
  return 0.2;
};

const findMatchingCandidates = async (project, limit = 10) => {
  const users = await User.find({
    _id: { $nin: [...project.members, project.host] },
    'profile.availability': { $in: ['Available', 'Limited'] },
    isVerified: true
  });
  
  const projectSkills = project.requiredSkills.map(s => s.skill.toLowerCase().replace(/\s+/g, ''));
  
  const scoredUsers = users
    .filter(user => {
      const userSkills = (user.profile.skills || []).map(s => s.name.toLowerCase().replace(/\s+/g, ''));
      return projectSkills.some(ps => userSkills.includes(ps));
    })
    .map(user => {
      const skillMatch = calculateSkillMatch(user.profile.skills || [], project.requiredSkills);
      const experienceScore = calculateExperienceScore(user);
      const fairnessPenalty = calculateFairnessPenalty(user.selectionFrequency);
      const workloadPenalty = calculateWorkloadPenalty(user.activeProjectCount);
      const contributionBonus = (user.contributionScore || 3.0) / 5.0;
      
      const totalScore = (
        skillMatch * 0.35 +
        experienceScore * 0.15 +
        fairnessPenalty * 0.15 +
        workloadPenalty * 0.15 +
        contributionBonus * 0.20
      );
      
      return {
        user,
        score: totalScore,
        breakdown: { skillMatch, experienceScore, fairnessPenalty, workloadPenalty, contributionBonus }
      };
    });
  
  return scoredUsers
    .filter(s => s.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

const findTeamCombinations = async (project, limit = 5) => {
  const candidates = await findMatchingCandidates(project, 20);
  const teamSize = project.teamSize - project.members.length;
  
  if (candidates.length < teamSize) return [];
  
  const combinations = [];
  const generateCombinations = (start, team, skillsCovered) => {
    if (team.length === teamSize) {
      const allSkillsCovered = project.requiredSkills.every(req => {
        const normalizedReqSkill = req.skill.toLowerCase().replace(/\s+/g, '');
        return team.some(member => 
          member.user.profile.skills.some(s => 
            s.name.toLowerCase().replace(/\s+/g, '') === normalizedReqSkill &&
            proficiencyScore[s.proficiency] >= proficiencyScore[req.minProficiency]
          )
        );
      });
      
      if (allSkillsCovered) {
        const avgScore = team.reduce((sum, m) => sum + m.score, 0) / team.length;
        combinations.push({ team, avgScore });
      }
      return;
    }
    
    for (let i = start; i < candidates.length && combinations.length < limit * 2; i++) {
      generateCombinations(i + 1, [...team, candidates[i]], skillsCovered);
    }
  };
  
  generateCombinations(0, [], new Set());
  
  return combinations
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, limit);
};

module.exports = { findMatchingCandidates, findTeamCombinations };
