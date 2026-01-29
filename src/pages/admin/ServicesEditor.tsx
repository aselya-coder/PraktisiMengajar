import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { iconMap } from "@/lib/iconMap";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Services from "@/components/Services";

const ServicesEditor = () => {
  const { data, updateSection, loading } = useContent();
  const servicesData = data?.services;
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: servicesData || {},
  });

  const watchedValues = useWatch({ control });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: "benefits",
  });

  const getPreviewData = () => {
    if (!watchedValues) return null;
    return {
      ...watchedValues,
      items: watchedValues.items?.map((item: any) => ({
        ...item,
        features: item.featuresString ? item.featuresString.split("\n").filter((f: string) => f.trim() !== "") : (item.features || [])
      })) || []
    };
  };

  useEffect(() => {
    if (servicesData) {
      const formattedData = {
        ...servicesData,
        items: servicesData.items.map((item: any) => ({
          ...item,
          featuresString: item.features ? item.features.join("\n") : ""
        }))
      };
      reset(formattedData);
    }
  }, [servicesData, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const cleanData = {
        ...formData,
        items: formData.items.map((item: any) => ({
          ...item,
          features: item.featuresString.split("\n").filter((f: string) => f.trim() !== ""),
          // Remove the temporary string field
        })).map(({ featuresString, ...rest }: any) => rest)
      };
      
      await updateSection("services", cleanData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Services Section</h2>
        <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-0 bg-background overflow-y-auto">
                    <DialogTitle className="sr-only">Preview Services</DialogTitle>
                    <div className="pt-10">
                        <Services />
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Main Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Section Label</Label>
              <Input {...register("section_title")} />
            </div>
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register("title")} className="font-bold" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Items</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendItem({ title: "", description: "", icon: "Briefcase", featuresString: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {itemFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border rounded-lg relative bg-card/50">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2" 
                    onClick={() => removeItem(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
                
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Service Title</Label>
                            <Input {...register(`items.${index}.title`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <select 
                                {...register(`items.${index}.icon`)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {Object.keys(iconMap).map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...register(`items.${index}.description`)} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>Features (One per line)</Label>
                        <Textarea 
                            {...register(`items.${index}.featuresString`)} 
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            rows={4}
                        />
                    </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Benefits List</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendBenefit({ title: "", description: "", icon: "Star" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Benefit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {benefitFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border rounded-lg relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2" 
                    onClick={() => removeBenefit(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
                
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input {...register(`benefits.${index}.title`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <select 
                                {...register(`benefits.${index}.icon`)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {Object.keys(iconMap).map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input {...register(`benefits.${index}.description`)} />
                    </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesEditor;
