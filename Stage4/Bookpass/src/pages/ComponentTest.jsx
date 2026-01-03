import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";

export default function ComponentTest() {
    const [checked, setChecked] = useState(false);
    const [switchValue, setSwitchValue] = useState(false);

    return (
        <div className="container mx-auto p-8 space-y-8" dir="ltr">
            <h1 className="text-3xl font-bold mb-6">UI Component Library Test</h1>

            {/* Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>Different button variants and sizes</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                    <Button>Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button size="lg">Large</Button>
                    <Button size="sm">Small</Button>
                    <Button size="icon">🎯</Button>
                </CardContent>
            </Card>

            {/* Form Elements */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Elements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="Enter your email" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={checked} onCheckedChange={setChecked} id="terms" />
                        <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch checked={switchValue} onCheckedChange={setSwitchValue} id="notifications" />
                        <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    <div className="space-y-2">
                        <Label>Select an option</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="option1">Option 1</SelectItem>
                                <SelectItem value="option2">Option 2</SelectItem>
                                <SelectItem value="option3">Option 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog */}
            <Card>
                <CardHeader>
                    <CardTitle>Dialog</CardTitle>
                </CardHeader>
                <CardContent>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Dialog Title</DialogTitle>
                                <DialogDescription>
                                    This is a dialog description. You can put any content here.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle>Tabs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="tab1">
                        <TabsList>
                            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tab1">Content for tab 1</TabsContent>
                        <TabsContent value="tab2">Content for tab 2</TabsContent>
                        <TabsContent value="tab3">Content for tab 3</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Badges */}
            <Card>
                <CardHeader>
                    <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                </CardContent>
            </Card>

            <Separator className="my-4" />

            {/* Tooltip */}
            <Card>
                <CardHeader>
                    <CardTitle>Tooltip</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline">Hover me</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This is a tooltip!</p>
                        </TooltipContent>
                    </Tooltip>
                </CardContent>
            </Card>
        </div>
    );
}
