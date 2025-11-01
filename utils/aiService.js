const axios = require('axios');
const logger = require('./logger');

/**
 * AI Service for interacting with AI APIs (OpenAI, custom models, etc.)
 */
class AIService {
  constructor() {
    this.apiUrl = process.env.AI_SERVICE_URL;
    this.apiKey = process.env.AI_API_KEY;
  }

  /**
   * Generate PRD compliance analysis
   */
  async analyzeComplianceScore(prd, commits, testResults) {
    try {
      const prompt = this._buildCompliancePrompt(prd, commits, testResults);
      
      const response = await this._callAI(prompt, {
        model: 'gpt-4',
        temperature: 0.3,
        max_tokens: 1500
      });

      return this._parseComplianceResponse(response);
    } catch (error) {
      logger.error(`AI Compliance Analysis Error: ${error.message}`);
      return this._getFallbackCompliance();
    }
  }

  /**
   * Generate document summary
   */
  async summarizeDocument(documentContent, documentType) {
    try {
      const prompt = `Summarize the following ${documentType} document. Provide:
1. A brief summary (2-3 sentences)
2. 5 key points
3. Main takeaways

Document content:
${documentContent.substring(0, 4000)}`;

      const response = await this._callAI(prompt, {
        model: 'gpt-4',
        temperature: 0.5,
        max_tokens: 800
      });

      return this._parseSummaryResponse(response);
    } catch (error) {
      logger.error(`AI Document Summary Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Analyze development insights
   */
  async generateDevelopmentInsights(commits, pullRequests, tasks) {
    try {
      const prompt = this._buildInsightsPrompt(commits, pullRequests, tasks);
      
      const response = await this._callAI(prompt, {
        model: 'gpt-4',
        temperature: 0.4,
        max_tokens: 1000
      });

      return this._parseInsightsResponse(response);
    } catch (error) {
      logger.error(`AI Development Insights Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Detect blockers and suggest solutions
   */
  async detectBlockers(task, projectContext) {
    try {
      const prompt = `Analyze the following task for potential blockers:

Task: ${task.title}
Description: ${task.description}
Status: ${task.status}
Dependencies: ${JSON.stringify(task.dependencies)}

Project Context: ${projectContext}

Identify:
1. Potential blockers
2. Risk level (low/medium/high)
3. Suggested solutions
4. Similar resolved issues (if any)`;

      const response = await this._callAI(prompt, {
        model: 'gpt-4',
        temperature: 0.4,
        max_tokens: 600
      });

      return this._parseBlockersResponse(response);
    } catch (error) {
      logger.error(`AI Blocker Detection Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate user stories from requirements
   */
  async generateUserStories(requirement) {
    try {
      const prompt = `Generate user stories for the following requirement:

Requirement: ${requirement}

Format each user story as:
- As a [user type], I want to [action] so that [benefit]
- Acceptance criteria (3-5 points)
- Estimated effort (in story points)

Generate 2-3 user stories.`;

      const response = await this._callAI(prompt, {
        model: 'gpt-4',
        temperature: 0.6,
        max_tokens: 800
      });

      return this._parseUserStoriesResponse(response);
    } catch (error) {
      logger.error(`AI User Story Generation Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Private method to call AI API
   */
  async _callAI(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    // This is a mock implementation - adapt to your AI service
    // For OpenAI:
    const response = await axios.post(
      `${this.apiUrl}/chat/completions`,
      {
        model: options.model || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.5,
        max_tokens: options.max_tokens || 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Build compliance analysis prompt
   */
  _buildCompliancePrompt(prd, commits, testResults) {
    return `Analyze PRD compliance based on the following data:

PRD Features: ${JSON.stringify(prd.features)}
Recent Commits: ${JSON.stringify(commits.slice(0, 10))}
Test Results: ${JSON.stringify(testResults)}

Provide:
1. Overall compliance score (0-100)
2. Feature completion percentage
3. List of deviations with severity
4. Recommendations for improvement`;
  }

  /**
   * Build development insights prompt
   */
  _buildInsightsPrompt(commits, pullRequests, tasks) {
    return `Analyze development progress:

Recent Commits (${commits.length}): ${JSON.stringify(commits.slice(0, 15))}
Pull Requests: ${JSON.stringify(pullRequests.slice(0, 10))}
Active Tasks: ${JSON.stringify(tasks.slice(0, 10))}

Provide insights on:
1. Development velocity
2. Code quality trends
3. Potential bottlenecks
4. Team collaboration patterns`;
  }

  /**
   * Parse AI responses
   */
  _parseComplianceResponse(response) {
    // Parse the AI response and structure it
    // This is a simplified implementation
    return {
      overallScore: 85,
      summary: response,
      recommendations: [],
      timestamp: new Date()
    };
  }

  _parseSummaryResponse(response) {
    return {
      summary: response,
      keyPoints: [],
      generatedAt: new Date()
    };
  }

  _parseInsightsResponse(response) {
    return {
      insights: response,
      generatedAt: new Date()
    };
  }

  _parseBlockersResponse(response) {
    return {
      blockers: [],
      suggestions: response,
      generatedAt: new Date()
    };
  }

  _parseUserStoriesResponse(response) {
    return {
      stories: response,
      generatedAt: new Date()
    };
  }

  /**
   * Fallback compliance data when AI is unavailable
   */
  _getFallbackCompliance() {
    return {
      overallScore: 0,
      summary: 'AI service unavailable. Manual review required.',
      recommendations: ['Configure AI service for automated analysis'],
      timestamp: new Date()
    };
  }
}

module.exports = new AIService();
