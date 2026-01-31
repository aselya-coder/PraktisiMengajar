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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Testimonials from "@/components/Testimonials";
import defaultDb from "@/data/db.json";

const TestimonialsEditor = () => {
  const { data, updateSection, loading } = useContent();
  const testimonialsData = data?.testimonials;
  const defaultTestimonials = defaultDb.content.testimonials;
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: defaultTestimonials || {},
  });

  const watchedValues = useWatch({ control });

  const getPreviewData = () => {
    if (!watchedValues) return null;
    return {
      ...watchedValues,
      items: watchedValues.items?.map((item: any) => ({
        ...item,
        rating: Number(item.rating)
      })) || []
    };
  };

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: "stats",
  });

  useEffect(() => {
    const sourceData = testimonialsData || defaultTestimonials;
    if (sourceData) {
      reset({
        ...defaultTestimonials,
        ...sourceData
      });
    }
  }, [testimonialsData, reset]);

  const onSubmit = async (formData: any) => {
    try {
      // Ensure ratings are numbers
      const cleanData = {
        ...formData,
        items: formData.items.map((item: any) => ({
          ...item,
          rating: Number(item.rating)
        }))
      };

      await updateSection("testimonials", cleanData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Testimonials Section</h2>
        <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-0 bg-background overflow-y-auto">
                    <DialogTitle className="sr-only">Preview Testimonials</DialogTitle>
                    <div className="pt-10">
                        <Testimonials previewData={getPreviewData()} />
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
            <CardTitle>Testimonials</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendItem({ name: "", role: "", institution: "", quote: "", rating: 5 })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
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
                            <Label>Name</Label>
                            <Input {...register(`items.${index}.name`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input {...register(`items.${index}.role`)} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input {...register(`items.${index}.institution`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Rating (1-5)</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                max="5" 
                                {...register(`items.${index}.rating`)} 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Quote</Label>
                        <Textarea {...register(`items.${index}.quote`)} rows={3} />
                    </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stats</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendStat({ value: "", label: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {statFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                    <Label>Value</Label>
                    <Input {...register(`stats.${index}.value`)} placeholder="e.g. 500+" />
                </div>
                <div className="space-y-2 flex-1">
                    <Label>Label</Label>
                    <Input {...register(`stats.${index}.label`)} placeholder="e.g. Sesi Terselenggara" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeStat(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
