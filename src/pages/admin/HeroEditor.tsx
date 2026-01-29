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
import Hero from "@/components/Hero";

const HeroEditor = () => {
  const { data, updateSection, loading } = useContent();
  const heroData = data?.hero;
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: heroData || {},
  });

  const watchedValues = useWatch({ control });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const { fields: statsFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: "stats",
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (heroData) {
      // benefits is array of strings, but useFieldArray expects objects usually or we need to handle it carefully
      // Actually useFieldArray works with object array better. 
      // If data.hero.benefits is ["a", "b"], react-hook-form might treat it as [ { value: "a" } ] if we map it, 
      // or we can just register inputs with index.
      
      // Let's check how react-hook-form handles array of strings. 
      // It's often easier to map ["a"] to [{value: "a"}] for the form and map back on submit.
      
      const formattedData = {
        ...heroData,
        benefits: heroData.benefits.map((b: string) => ({ value: b })),
        // stats is already an array of objects {value, label}, so it should map automatically correctly
        // but if it's missing in initial load, we should handle it.
        stats: heroData.stats || []
      };
      reset(formattedData);
    }
  }, [heroData, reset]);

  const onSubmit = async (formData: any) => {
    try {
      // Map benefits back to string array
      const cleanData = {
        ...formData,
        benefits: formData.benefits.map((b: any) => b.value)
      };
      
      await updateSection("hero", cleanData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Hero Section</h2>
        <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-0 bg-background overflow-y-auto">
                    <DialogTitle className="sr-only">Preview Hero</DialogTitle>
                    <div className="pt-10"> {/* Padding for close button */}
                        <Hero />
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
              <Label>Badge Text</Label>
              <Input {...register("badge")} placeholder="e.g. Mitra Pendidikan Terpercaya" />
            </div>
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Textarea {...register("title")} className="font-bold text-lg" rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea {...register("subtitle")} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Hero Image URL</Label>
              <Input {...register("image")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Primary Button</h3>
              <div className="space-y-2">
                <Label>Text</Label>
                <Input {...register("cta_primary.text")} />
              </div>
              <div className="space-y-2">
                <Label>Link</Label>
                <Input {...register("cta_primary.link")} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Secondary Button</h3>
              <div className="space-y-2">
                <Label>Text</Label>
                <Input {...register("cta_secondary.text")} />
              </div>
              <div className="space-y-2">
                <Label>Link</Label>
                <Input {...register("cta_secondary.link")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Floating Stats</CardTitle>
            <Button variant="outline" size="sm" onClick={() => appendStat({ value: "", label: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="grid gap-2 flex-1">
                    <Input 
                      {...register(`stats.${index}.value`)} 
                      placeholder="Value (e.g. 98%)" 
                    />
                    <Input 
                      {...register(`stats.${index}.label`)} 
                      placeholder="Label (e.g. Satisfaction)" 
                    />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeStat(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Benefits List</CardTitle>
            <Button variant="outline" size="sm" onClick={() => append({ value: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Benefit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input 
                  {...register(`benefits.${index}.value`)} 
                  placeholder="Benefit text" 
                />
                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
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

export default HeroEditor;
