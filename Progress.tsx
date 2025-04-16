import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useRoutines } from "@/hooks/useRoutines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Calendar, Dumbbell, Trophy, TrendingUp } from "lucide-react";

export default function Progress() {
  const { workoutsCompleted, workoutsByCategory, workoutStreak } = useUser();
  const { routines } = useRoutines();
  
  // Prepare data for charts
  const weeklyData = [
    { name: "Mon", workouts: 1 },
    { name: "Tue", workouts: 2 },
    { name: "Wed", workouts: 0 },
    { name: "Thu", workouts: 1 },
    { name: "Fri", workouts: 2 },
    { name: "Sat", workouts: 0 },
    { name: "Sun", workouts: 1 },
  ];
  
  const categoryData = [
    { name: "Upper Body", value: workoutsByCategory.upperBody },
    { name: "Lower Body", value: workoutsByCategory.lowerBody },
    { name: "Core", value: workoutsByCategory.core },
    { name: "Cardio", value: workoutsByCategory.cardio },
  ].filter(item => item.value > 0);
  
  const COLORS = ['#4F46E5', '#10B981', '#F97316', '#EF4444'];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-heading font-bold text-2xl mb-6">Workout Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workouts
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutsCompleted}</div>
            <p className="text-xs text-gray-500">
              Completed workouts this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workout Streak
            </CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutStreak} days</div>
            <p className="text-xs text-gray-500">
              Keep it up to reach your goals!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Routines Created
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routines.length}</div>
            <p className="text-xs text-gray-500">
              Custom workout routines
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Workout Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Complete workouts to see your category breakdown</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Progress Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="mr-2 h-5 w-5 text-primary">•</div>
              <span>Consistency is key - aim for at least 3-4 workouts per week</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 h-5 w-5 text-primary">•</div>
              <span>Mix different exercise categories for a balanced workout regimen</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 h-5 w-5 text-primary">•</div>
              <span>Gradually increase intensity as you get stronger</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 h-5 w-5 text-primary">•</div>
              <span>Rest and recovery are just as important as your workouts</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
