const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Notification Service for creating and sending notifications
 */
class NotificationService {
  /**
   * Create a notification
   */
  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      
      // Emit real-time notification via Socket.IO
      const io = global.io;
      if (io) {
        io.to(`user:${data.recipient}`).emit('notification', notification);
      }

      // Send email if enabled
      if (data.channels?.email) {
        await this.sendEmailNotification(notification);
      }

      // Send Slack message if enabled
      if (data.channels?.slack) {
        await this.sendSlackNotification(notification);
      }

      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(recipients, notificationData) {
    const notifications = recipients.map(recipientId => ({
      ...notificationData,
      recipient: recipientId
    }));

    try {
      const created = await Notification.insertMany(notifications);
      
      // Emit to all recipients
      const io = global.io;
      if (io) {
        created.forEach(notification => {
          io.to(`user:${notification.recipient}`).emit('notification', notification);
        });
      }

      return created;
    } catch (error) {
      logger.error(`Error sending bulk notifications: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(notification) {
    // Implement email sending logic here
    // This would integrate with your email service (SendGrid, SES, etc.)
    logger.info(`Email notification sent to user ${notification.recipient}`);
  }

  /**
   * Send Slack notification
   */
  async sendSlackNotification(notification) {
    // Implement Slack webhook logic here
    logger.info(`Slack notification sent for user ${notification.recipient}`);
  }

  /**
   * Notify task assignment
   */
  async notifyTaskAssignment(task, assignedTo, assignedBy) {
    return this.createNotification({
      recipient: assignedTo,
      sender: assignedBy,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `You have been assigned to: ${task.title}`,
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      actionUrl: `/tasks/${task._id}`,
      channels: {
        inApp: true,
        email: true
      }
    });
  }

  /**
   * Notify task handoff
   */
  async notifyTaskHandoff(task, toUser, fromUser, notes) {
    return this.createNotification({
      recipient: toUser,
      sender: fromUser,
      type: 'task_handoff',
      title: 'Task Handed Off to You',
      message: `Task "${task.title}" has been handed off to you`,
      priority: 'high',
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      actionUrl: `/tasks/${task._id}`,
      metadata: { notes },
      channels: {
        inApp: true,
        email: true,
        slack: true
      }
    });
  }

  /**
   * Notify PRD approval
   */
  async notifyPRDApproval(prd, approver, status) {
    return this.createNotification({
      recipient: prd.author,
      sender: approver,
      type: 'prd_approved',
      title: `PRD ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your PRD "${prd.title}" has been ${status}`,
      priority: 'high',
      relatedEntity: {
        entityType: 'prd',
        entityId: prd._id
      },
      actionUrl: `/prds/${prd._id}`,
      channels: {
        inApp: true,
        email: true
      }
    });
  }

  /**
   * Notify deployment status
   */
  async notifyDeployment(pipeline, recipients, status) {
    const notificationType = status === 'success' 
      ? 'deployment_success' 
      : 'deployment_failed';

    const notifications = recipients.map(recipient => ({
      recipient,
      type: notificationType,
      title: `Deployment ${status === 'success' ? 'Successful' : 'Failed'}`,
      message: `Pipeline ${pipeline.name} ${status} in ${pipeline.environment}`,
      priority: status === 'failed' ? 'urgent' : 'medium',
      relatedEntity: {
        entityType: 'deployment',
        entityId: pipeline._id
      },
      channels: {
        inApp: true,
        email: status === 'failed',
        slack: true
      }
    }));

    return this.sendBulkNotifications(recipients, notifications[0]);
  }
}

module.exports = new NotificationService();
