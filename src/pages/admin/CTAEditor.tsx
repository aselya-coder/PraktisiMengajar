import { useForm, useWatch } from "react-hook-form";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CTA from "@/components/CTA";
import defaultDb from "@/data/db.json";

const CTAEditor = () => {
  const { data, updateSection, loading } = useContent();
  const ctaData = data?.cta;
  const defaultCTA = defaultDb.content.cta;
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: defaultCTA || {},
  });

  const watchedValues = useWatch({ control });

  const getPreviewData = () => {
    if (!watchedValues) return null;
    return watchedValues;
  };

  useEffect(() => {
    const sourceData = ctaData || defaultCTA;
    if (sourceData) {
      reset({
        ...defaultCTA,
        ...sourceData
      });
    }
  }, [ctaData, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateSection("cta", formData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save CTA section");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit CTA Section</h2>
        <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Live Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[100vw] h-screen p-0 border-0 bg-background overflow-y-auto">
                    <DialogTitle className="sr-only">Preview CTA Section</DialogTitle>
                    <div className="pt-20">
                        <CTA previewData={getPreviewData()} />
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title (Small)</Label>
            <Input {...register("section_title")} />
          </div>
          <div className="space-y-2">
            <Label>Main Title</Label>
            <Input {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary Button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input {...register("cta_primary.text")} />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input {...register("cta_primary.link")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input {...register("cta_whatsapp.text")} />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input {...register("cta_whatsapp.link")} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("contact_info.phone")} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register("contact_info.email")} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...register("contact_info.location")} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTAEditor;
