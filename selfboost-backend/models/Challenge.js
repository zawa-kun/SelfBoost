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
  goalType: {
    type: String,
    enum: ['ページ', '日', '時間', '分', '回', '章','km'],
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
    lastUpdateDate: {
      type: Date,
      default: Date.now,
    },
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
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

challengeSchema.virtual('participantStatus').get(function() {
  return function(userId) {
    const participant = this.participants.find(p => p.user.toString() === userId);
    
    if (!participant) return '未参加';
    if (participant.progress >= this.goalValue) return '完了';
    if (participant.progress > 0) return '進行中';
    return '未開始';
  };
});

// JSON変換時に仮想フィールドを含める
challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Challenge', challengeSchema);