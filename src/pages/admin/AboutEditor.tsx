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
import About from "@/components/About";
import defaultDb from "@/data/db.json";

const AboutEditor = () => {
  const { data, updateSection, loading } = useContent();
  const aboutData = data?.about;
  const defaultAbout = defaultDb.content.about;
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: {
      ...defaultAbout,
      features: defaultAbout.features.map(f => ({ value: f })),
    },
  });

  const watchedValues = useWatch({ control });

  const getPreviewData = () => {
    if (!watchedValues) return null;
    return {
      ...watchedValues,
      features: Array.isArray(watchedValues.features) 
        ? watchedValues.features.map((f: any) => f.value) 
        : []
    };
  };

  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({
    control,
    name: "values",
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    const sourceData = aboutData || defaultAbout;
    
    if (sourceData) {
      const features = sourceData.features || defaultAbout.features || [];
      const values = sourceData.values || defaultAbout.values || [];

      const formattedData = {
        ...defaultAbout,
        ...sourceData,
        // features is string array, map to objects for field array
        features: Array.isArray(features) 
          ? features.map((f: any) => (typeof f === 'string' ? { value: f } : f))
          : [],
        values: values
      };
      reset(formattedData);
    }
  }, [aboutData, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const cleanData = {
        ...formData,
        features: formData.features.map((f: any) => f.value)
      };
      
      await updateSection("about", cleanData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit About Section</h2>
        <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-0 bg-background overflow-y-auto">
                    <DialogTitle className="sr-only">Preview About</DialogTitle>
                    <div className="pt-10">
                        <About previewData={getPreviewData()} />
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

            <div className="space-y-2">
              <Label>Sub Description</Label>
              <Textarea {...register("sub_description")} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Core Values</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendValue({ title: "", description: "", icon: "Shield" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Value
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {valueFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border rounded-lg relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2" 
                    onClick={() => removeValue(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
                
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input {...register(`values.${index}.title`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <select 
                                {...register(`values.${index}.icon`)}
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
                        <Input {...register(`values.${index}.description`)} />
                    </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Features List</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendFeature({ value: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 mb-4">
                <Label>Features Title</Label>
                <Input {...register("features_title")} />
            </div>
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input 
                  {...register(`features.${index}.value`)} 
                  placeholder="Feature text" 
                />
                <Button variant="ghost" size="icon" onClick={() => removeFeature(index)}>
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

export default AboutEditor;
