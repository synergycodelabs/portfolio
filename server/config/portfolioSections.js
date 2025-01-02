/**
 * Configuration for portfolio sections and their associated prompts
 * Used to provide consistent section references across the application
 */

export const PORTFOLIO_SECTIONS = {
  ABOUT: 'About',
  EXPERIENCE: 'Experience',
  SKILLS: 'Skills',
  PROJECTS: 'Projects',
  RESUME: 'Resume'
};

export const SECTION_PROMPTS = {
  [PORTFOLIO_SECTIONS.ABOUT]: "Let me tell you about Angel's background...",
  [PORTFOLIO_SECTIONS.EXPERIENCE]: "Here's Angel's professional experience...",
  [PORTFOLIO_SECTIONS.SKILLS]: "Angel specializes in these technologies...",
  [PORTFOLIO_SECTIONS.PROJECTS]: "Let me share some of Angel's key projects...",
  [PORTFOLIO_SECTIONS.RESUME]: "From Angel's resume..."
};