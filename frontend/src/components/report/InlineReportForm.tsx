import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/api/apiClient';
import { useReportCreate } from '@/api/reports/useReportCreate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

// Define interface for component props
interface InlineReportFormProps {
  post: any; // Replace with your Post type if available
  onComplete: () => void;
}

// Define interface for form data
interface ReportFormData {
  title: string;
  description: string;
  reported_user?: string;
  community?: string;
}

export function InlineReportForm({ post, onComplete }: InlineReportFormProps) {
  const [evidenceLinks, setEvidenceLinks] = useState(['']);
  const createReportMutation = useReportCreate();

  const postUrl = `${window.location.origin}/posts/${post.id}`;
  
  const form = useForm<ReportFormData>({
    defaultValues: {
      title: 'Report: Inappropriate Post',
      description: `I would like to report the following post content:\n\n"${post.content}"\n\n`,
      reported_user: post.created_by?.id?.toString() || '',
      community: post.community?.id?.toString() || '',
    },
  });

  // Initialize with post URL as first evidence link
  React.useEffect(() => {
    setEvidenceLinks([postUrl]);
  }, [postUrl]);

  const handleAddEvidenceLink = () => {
    setEvidenceLinks([...evidenceLinks, '']);
  };

  const handleRemoveEvidenceLink = (index: number) => {
    const newLinks = [...evidenceLinks];
    newLinks.splice(index, 1);
    setEvidenceLinks(newLinks);
  };

  const handleEvidenceLinkChange = (index: number, value: string) => {
    const newLinks = [...evidenceLinks];
    newLinks[index] = value;
    setEvidenceLinks(newLinks);
  };

  const onSubmit = (data: ReportFormData) => {
    const filteredLinks = evidenceLinks.filter(link => link.trim() !== '');
    
    const reportData = {
      ...data,
      // No category field
      reported_user: data.reported_user ? Number(data.reported_user) : undefined,
      community: data.community ? Number(data.community) : undefined,
      evidence_links: filteredLinks,
      post: post.id
    };

    createReportMutation.mutate(reportData, {
      onSuccess: () => {
        toast.success("Report submitted successfully");
        onComplete();
      },
      onError: (error) => {
        toast.error("Failed to submit report");
        console.error("Report submission error:", error);
      }
    });
  };

  return (
    <div className="py-4">
      <p className="text-gray-500 mb-4">
        Please provide additional details about why you're reporting this post.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Brief summary of the issue" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a detailed description of the issue" 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <FormLabel>Evidence Links</FormLabel>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddEvidenceLink}
              >
                Add Link
              </Button>
            </div>
            
            {evidenceLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={link}
                  onChange={(e) => handleEvidenceLinkChange(index, e.target.value)}
                  placeholder="https://example.com/evidence"
                />
                {evidenceLinks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveEvidenceLink(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onComplete}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}