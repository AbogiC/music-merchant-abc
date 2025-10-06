import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfilePage = ({ cart, setCurrentPage }) => (
  <div className="container py-8">
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Authentication is not enabled yet. In the future, you'll be able
              to:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Save your favorite products</li>
              <li>• Track order history</li>
              <li>• Manage shipping addresses</li>
              <li>• Set preferences</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shopping History</CardTitle>
            <CardDescription>View your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Current cart contents:</p>
            {cart.length > 0 ? (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your cart is empty
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default ProfilePage;
