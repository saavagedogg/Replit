import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  description: string;
}

const BULKING_MEALS: Meal[] = [
  {
    name: "High-Protein Breakfast Bowl",
    calories: 800,
    protein: 40,
    description: "Oatmeal with protein powder, banana, sunflower seeds, and honey"
  },
  {
    name: "Mass Gainer Smoothie",
    calories: 1000,
    protein: 50,
    description: "Blend: milk, protein powder, oats, banana, sunflower butter, honey"
  },
  {
    name: "Protein-Packed Lunch",
    calories: 900,
    protein: 45,
    description: "Chicken breast, brown rice, avocado, olive oil, sweet potato"
  },
  {
    name: "Muscle Building Dinner",
    calories: 850,
    protein: 48,
    description: "Salmon, quinoa, mixed vegetables, olive oil"
  },
  {
    name: "Post-Workout Power Meal",
    calories: 750,
    protein: 52,
    description: "Greek yogurt, granola, mixed berries, honey, pumpkin seeds"
  },
  {
    name: "High-Calorie Bowl",
    calories: 920,
    protein: 46,
    description: "Ground beef, sweet potato, avocado, cheese, olive oil"
  }
];

const CUTTING_MEALS: Meal[] = [
  {
    name: "Lean Breakfast",
    calories: 350,
    protein: 35,
    description: "Egg whites, turkey bacon, whole grain toast"
  },
  {
    name: "Protein Smoothie",
    calories: 250,
    protein: 30,
    description: "Oat milk, protein powder, berries, spinach"
  },
  {
    name: "Light Lunch",
    calories: 400,
    protein: 40,
    description: "Grilled chicken breast, mixed greens, light dressing"
  },
  {
    name: "Lean Dinner",
    calories: 450,
    protein: 42,
    description: "White fish, steamed vegetables, quinoa"
  },
  {
    name: "Post-Workout Snack",
    calories: 200,
    protein: 25,
    description: "Greek yogurt, honey, mixed berries"
  },
  {
    name: "Protein Bowl",
    calories: 380,
    protein: 45,
    description: "Tuna, brown rice, edamame, cucumber, light mayo"
  }
];

export default function Nutrition() {
  const [goal, setGoal] = useState<'bulk' | 'cut'>('bulk');

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-heading font-bold text-2xl mb-6">Nutrition Guide</h1>

      <Tabs value={goal} onValueChange={(value) => setGoal(value as 'bulk' | 'cut')}>
        <TabsList className="mb-6">
          <TabsTrigger value="bulk">Gain Weight</TabsTrigger>
          <TabsTrigger value="cut">Lose Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BULKING_MEALS.map((meal) => (
              <Card key={meal.name}>
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                  <div className="flex space-x-4">
                    <span className="text-sm font-medium">Calories: {meal.calories}</span>
                    <span className="text-sm font-medium">Protein: {meal.protein}g</span>
                  </div>
                  <div className="mt-4">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        meal.name === "High-Protein Breakfast Bowl" ? "1494597564530-871f2b93ac55" :
                        meal.name === "Mass Gainer Smoothie" ? "1570696516188-ade861b84721" :
                        meal.name === "Protein-Packed Lunch" ? "1467453678174-24afc1e0bf69" :
                        meal.name === "Muscle Building Dinner" ? "1467003909754-2fd8a7c7bd41" :
                        meal.name === "Post-Workout Power Meal" ? "1511690656952-34342bb7c2f2" :
                        meal.name === "High-Calorie Bowl" ? "1490645935967-10de6ba17061" :
                        meal.name === "Lean Breakfast" ? "1494859802809-d069c3b71a8c" :
                        meal.name === "Protein Smoothie" ? "1526424382096-74b2c85c4a48" :
                        meal.name === "Light Lunch" ? "1546069901-d5b87c7e4da2" :
                        meal.name === "Lean Dinner" ? "1467003909754-2fd8a7c7bd41" :
                        meal.name === "Post-Workout Snack" ? "1488477181946-6428a0291777" :
                        "1490645935967-10de6ba17061"
                      }?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={meal.name}
                      className="w-full h-48 object-cover rounded-md"
                      loading="lazy"
                      decoding="async"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(meal.name)}`;
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cut">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CUTTING_MEALS.map((meal) => (
              <Card key={meal.name}>
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                  <div className="flex space-x-4">
                    <span className="text-sm font-medium">Calories: {meal.calories}</span>
                    <span className="text-sm font-medium">Protein: {meal.protein}g</span>
                  </div>
                  <div className="mt-4">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        meal.name === "High-Protein Breakfast Bowl" ? "1494597564530-871f2b93ac55" :
                        meal.name === "Mass Gainer Smoothie" ? "1570696516188-ade861b84721" :
                        meal.name === "Protein-Packed Lunch" ? "1467453678174-24afc1e0bf69" :
                        meal.name === "Muscle Building Dinner" ? "1467003909754-2fd8a7c7bd41" :
                        meal.name === "Post-Workout Power Meal" ? "1511690656952-34342bb7c2f2" :
                        meal.name === "High-Calorie Bowl" ? "1490645935967-10de6ba17061" :
                        meal.name === "Lean Breakfast" ? "1494859802809-d069c3b71a8c" :
                        meal.name === "Protein Smoothie" ? "1526424382096-74b2c85c4a48" :
                        meal.name === "Light Lunch" ? "1546069901-d5b87c7e4da2" :
                        meal.name === "Lean Dinner" ? "1467003909754-2fd8a7c7bd41" :
                        meal.name === "Post-Workout Snack" ? "1488477181946-6428a0291777" :
                        "1490645935967-10de6ba17061"
                      }?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={meal.name}
                      className="w-full h-48 object-cover rounded-md"
                      loading="lazy"
                      decoding="async"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(meal.name)}`;
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}