import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import defaultDb from "@/data/db.json";
import { HeaderSection, FooterSection } from "@/types/content";

interface FooterFormValues extends Omit<FooterSection, 'services_list'> {
  services_list: { value: string }[];
}

const LayoutEditor = () => {
  const { data, updateSection, loading } = useContent();
  const headerData = data?.header;
  const footerData = data?.footer;
  
  const defaultHeader = defaultDb.content.header;
  const defaultFooter = defaultDb.content.footer;

  const [footerPreviewOpen, setFooterPreviewOpen] = useState(false);
  const [headerPreviewOpen, setHeaderPreviewOpen] = useState(false);

  // Header Form
  const { 
    register: registerHeader, 
    control: controlHeader, 
    handleSubmit: handleSubmitHeader, 
    reset: resetHeader,
    formState: { isDirty: isHeaderDirty } 
  } = useForm<HeaderSection>({
    defaultValues: defaultHeader || {},
  });

  const { fields: navFields, append: appendNav, remove: removeNav } = useFieldArray({
    control: controlHeader,
    name: "nav_links",
  });

  const watchedHeaderValues = useWatch({ control: controlHeader });

  // Footer Form
  const { 
    register: registerFooter, 
    control: controlFooter, 
    handleSubmit: handleSubmitFooter, 
    reset: resetFooter,
    formState: { isDirty: isFooterDirty } 
  } = useForm<FooterFormValues>({
    defaultValues: {
      ...defaultFooter,
      services_list: defaultFooter.services_list.map(s => ({ value: s }))
    },
  });

  const { fields: quickLinkFields, append: appendQuickLink, remove: removeQuickLink } = useFieldArray({
    control: controlFooter,
    name: "quick_links",
  });

  const { fields: serviceListFields, append: appendServiceList, remove: removeServiceList } = useFieldArray({
    control: controlFooter,
    name: "services_list",
  });

  const watchedFooterValues = useWatch({ control: controlFooter });

  const getHeaderPreviewData = () => {
    if (!watchedHeaderValues) return null;
    return watchedHeaderValues as HeaderSection;
  };

  const getFooterPreviewData = () => {
    if (!watchedFooterValues) return null;
    return {
      ...watchedFooterValues,
      services_list: Array.isArray(watchedFooterValues.services_list) 
        ? watchedFooterValues.services_list.map((s) => s?.value || "") 
        : []
    } as FooterSection;
  };

  useEffect(() => {
    const sourceHeader = headerData || defaultHeader;
    if (sourceHeader) resetHeader({ ...defaultHeader, ...sourceHeader });
    
    const sourceFooter = footerData || defaultFooter;
    if (sourceFooter) {
        // services_list is string array, map to object for field array
        const servicesList = sourceFooter.services_list || defaultFooter.services_list || [];
        
        const formattedFooter = {
            ...defaultFooter,
            ...sourceFooter,
            services_list: Array.isArray(servicesList) 
              ? servicesList.map((s: string | { value: string }) => (typeof s === 'string' ? { value: s } : s))
              : []
        };
        resetFooter(formattedFooter);
    }
  }, [headerData, footerData, resetHeader, resetFooter, defaultHeader, defaultFooter]);

  const onHeaderSubmit = async (formData: HeaderSection) => {
    try {
      await updateSection("header", formData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save header");
    }
  };

  const onFooterSubmit = async (formData: FooterFormValues) => {
    try {
      const cleanData: FooterSection = {
        ...formData,
        services_list: formData.services_list.map((s) => s.value)
      };

      await updateSection("footer", cleanData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save footer");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Layout (Header & Footer)</h2>

      <Tabs defaultValue="header">
        <TabsList>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
            <div className="flex justify-end gap-2">
                <Dialog open={headerPreviewOpen} onOpenChange={setHeaderPreviewOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Header
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[100vw] h-[200px] p-0 border-0 bg-transparent overflow-y-visible">
                        <DialogTitle className="sr-only">Preview Header</DialogTitle>
                        <div className="pt-0">
                            <Header previewData={getHeaderPreviewData()} />
                        </div>
                    </DialogContent>
                </Dialog>
                <Button onClick={handleSubmitHeader(onHeaderSubmit)} disabled={!isHeaderDirty}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Header
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Logo & Title</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Logo Text</Label>
                        <Input {...registerHeader("logo_text")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Site Title</Label>
                        <Input {...registerHeader("title")} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Navigation Links</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => appendNav({ label: "", href: "" })}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {navFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                            <div className="space-y-2 flex-1">
                                <Label>Label</Label>
                                <Input {...registerHeader(`nav_links.${index}.label`)} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>Link (href)</Label>
                                <Input {...registerHeader(`nav_links.${index}.href`)} />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeNav(index)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Header Buttons</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-medium">Secondary (Left)</h3>
                        <div className="space-y-2">
                            <Label>Text</Label>
                            <Input {...registerHeader("cta_buttons.secondary.text")} placeholder="Konsultasi" />
                        </div>
                        <div className="space-y-2">
                            <Label>Link</Label>
                            <Input {...registerHeader("cta_buttons.secondary.link")} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-medium">Primary (Right)</h3>
                        <div className="space-y-2">
                            <Label>Text</Label>
                            <Input {...registerHeader("cta_buttons.primary.text")} placeholder="Ajukan Praktisi" />
                        </div>
                        <div className="space-y-2">
                            <Label>Link</Label>
                            <Input {...registerHeader("cta_buttons.primary.link")} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
            <div className="flex justify-end gap-2">
                <Dialog open={footerPreviewOpen} onOpenChange={setFooterPreviewOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Footer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[100vw] h-[600px] p-0 border-0 bg-transparent overflow-y-auto">
                        <DialogTitle className="sr-only">Preview Footer</DialogTitle>
                        <div className="pt-0">
                            <Footer previewData={getFooterPreviewData()} />
                        </div>
                    </DialogContent>
                </Dialog>
                <Button onClick={handleSubmitFooter(onFooterSubmit)} disabled={!isFooterDirty}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Footer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...registerFooter("description")} rows={2} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input {...registerFooter("contact_info.phone")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input {...registerFooter("contact_info.email")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input {...registerFooter("contact_info.address")} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quick Links</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => appendQuickLink({ label: "", href: "" })}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {quickLinkFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                            <div className="space-y-2 flex-1">
                                <Label>Label</Label>
                                <Input {...registerFooter(`quick_links.${index}.label`)} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>Link (href)</Label>
                                <Input {...registerFooter(`quick_links.${index}.href`)} />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeQuickLink(index)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Services List (Footer)</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => appendServiceList({ value: "" })}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {serviceListFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input 
                                {...registerFooter(`services_list.${index}.value`)} 
                                placeholder="Service Name" 
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeServiceList(index)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>WhatsApp CTA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Text</Label>
                        <Input {...registerFooter("whatsapp_cta.text")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Link</Label>
                        <Input {...registerFooter("whatsapp_cta.link")} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LayoutEditor;
