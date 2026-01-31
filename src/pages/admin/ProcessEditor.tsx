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
import Process from "@/components/Process";
import defaultDb from "@/data/db.json";
import { ProcessSection } from "@/types/content";

const ProcessEditor = () => {
  const { data, updateSection, loading } = useContent();
  const processData = data?.process;
  const defaultProcess = defaultDb.content.process;
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { isDirty } } = useForm<ProcessSection>({
    defaultValues: defaultProcess || {},
  });

  const watchedValues = useWatch({ control });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const getPreviewData = () => {
    if (!watchedValues) return null;
    return watchedValues as ProcessSection;
  };

  useEffect(() => {
    const sourceData = processData || defaultProcess;
    if (sourceData) {
      reset({
        ...defaultProcess,
        ...sourceData
      });
    }
  }, [processData, reset, defaultProcess]);

  const onSubmit = async (formData: ProcessSection) => {
    try {
      await updateSection("process", formData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Process Section</h2>
        <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-0 bg-background overflow-y-auto">
                    <DialogTitle className="sr-only">Preview Process</DialogTitle>
                    <div className="pt-10">
                        <Process previewData={getPreviewData()} />
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
            <CardTitle>Steps</CardTitle>
            <Button variant="outline" size="sm" onClick={() => append({ number: "0" + (fields.length + 1), title: "", description: "", icon: "Check" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border rounded-lg relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2" 
                    onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
                
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Step Number</Label>
                            <Input {...register(`steps.${index}.number`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input {...register(`steps.${index}.title`)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <select 
                                {...register(`steps.${index}.icon`)}
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
                        <Input {...register(`steps.${index}.description`)} />
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

export default ProcessEditor;
