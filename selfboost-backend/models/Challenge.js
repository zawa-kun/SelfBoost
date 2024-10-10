const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  goalType: {
    type: String,
    enum: ['pages', 'days', 'hours', 'minutes', 'times', 'custom'],
    required: true,
  },
  goalValue: {
    type: Number,
    required: true,
    min: 1,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    progress: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    dailyProgress: [{
      date: Date,
      value: Number
    }],
    lastUpdateDate: {
      type: Date,
      default: Date.now,
    },
    streak: {
      type: Number,
      default: 0,
    },
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    required: true,
    trim: true,
  },
  milestones: [{
    description: String,
    value: Number,
  }],
}, { timestamps: true });

// 仮想フィールド
challengeSchema.virtual('totalParticipants').get(function() {
  return this.participants.length;
});
challengeSchema.virtual('averageProgress').get(function() {
  if (this.participants.length === 0) return 0;
  const totalProgress = this.participants.reduce((sum, participant) => sum + participant.progress, 0);
  return totalProgress / this.participants.length;
});

// 参加者のチャレンジの進捗状態の確認
challengeSchema.methods.getParticipantStatus = function(participantId) {
  const participant = this.participants.id(participantId);
  if (!participant) return null;
  
  if (participant.progress >= this.goalValue) return 'completed';
  if (participant.progress > 0) return 'in progress';
  return 'not started';
};

challengeSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

// JSON変換時に仮想フィールドを含める
challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Challenge', challengeSchema);