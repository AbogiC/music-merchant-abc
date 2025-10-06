import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smartphone, Monitor, Settings } from "lucide-react";

const ServicesPage = () => (
  <div className="container py-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">Apps & Services</h1>
      <p className="text-muted-foreground">
        Digital tools and services to enhance your musical journey
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Music Learning App</CardTitle>
          <CardDescription>
            Interactive lessons and practice tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Step-by-step tutorials</li>
            <li>• Real-time feedback</li>
            <li>• Progress tracking</li>
            <li>• Metronome & tuner</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Download App - $9.99/month</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Virtual Lessons</CardTitle>
          <CardDescription>
            One-on-one instruction with professional teachers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Certified instructors</li>
            <li>• Flexible scheduling</li>
            <li>• All skill levels</li>
            <li>• Multiple instruments</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Book Lesson - $50/hour</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Instrument Repair</CardTitle>
          <CardDescription>
            Professional maintenance and repair services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Expert technicians</li>
            <li>• Quick turnaround</li>
            <li>• Quality guarantee</li>
            <li>• Pickup & delivery</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Schedule Service</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
);

export default ServicesPage;
