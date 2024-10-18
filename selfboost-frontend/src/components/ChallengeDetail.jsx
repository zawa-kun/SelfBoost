import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

const ChallengeDetail = ({ challenge }) => {
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
        <Progress value={challenge.progressPercentage} className="w-full" />
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