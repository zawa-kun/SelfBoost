import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";

const goalTypeColors = {
  'ページ': 'bg-blue-600',
  '日': 'bg-green-600',
  '時間': 'bg-yellow-600',
  '分': 'bg-red-600',
  '回': 'bg-purple-600',
  '章': 'bg-indigo-600',
  'km': 'bg-pink-600',
  'default': 'bg-gray-600'
};

const ChallengeDetail = ({ challenge }) => {
  const progressColor = goalTypeColors[challenge.goalType] || goalTypeColors['default'];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span>進捗状況</span>
          <span>{challenge.progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`${progressColor} h-2.5 rounded-full`}
            style={{ width: `${challenge.progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          目標: {challenge.goalValue} {challenge.goalType}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          開始日: {new Date(challenge.userJoinedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeDetail;