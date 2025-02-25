import { Dataset } from '@/app/(workspace)/(workspace-main)/_types';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import useDatasetList from '../../_hooks/use-dataset-list';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

import { datasetQueries } from '@/constants/querykey-factory';
import useUploadImages from '../../_hooks/use-upload-images';

const NewUploadImagesSheet = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  const { data } = useDatasetList();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const duplicates: string[] = [];
      const newFiles: File[] = [];

      acceptedFiles.forEach((file) => {
        if (files.some((existingFile) => existingFile.name === file.name)) {
          duplicates.push(file.name);
        } else {
          newFiles.push(file);
        }
      });

      if (duplicates.length > 0) {
        toast.error(
          `Duplicate file${duplicates.length > 1 ? 's' : ''} detected: ${duplicates.join(', ')}`,
        );
      }

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [files],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
        '.bmp',
        '.tiff',
        '.tif',
        '.svg',
        '.heic',
        '.heif',
      ],
    },
    multiple: true,
  });

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const handleSheetClose = () => {
    setFiles([]);
    setSelectedDataset('');
    onClose();
  };

  const uploadMutation = useUploadImages();

  const handleUpload = async () => {
    if (!selectedDataset || files.length === 0) return;

    setIsLoading(true);
    try {
      await uploadMutation.mutateAsync({
        datasetId: selectedDataset,
        files,
      });
      toast.success('Files uploaded successfully');
      handleSheetClose();

      queryClient.invalidateQueries({
        queryKey: datasetQueries.default(),
      });
    } catch (error) {
      toast.error('Failed to upload files');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetClose}>
      <SheetContent className="min-w-96">
        <SheetHeader>
          <SheetTitle>Upload images</SheetTitle>
          <SheetDescription>
            Please note: You can only drag and drop image files, not complete
            folders.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-3 space-y-4">
          <div>
            <div className="text-xs mb-1">Choose a dataset</div>
            <Select onValueChange={setSelectedDataset} value={selectedDataset}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="text-sm">
                {data?.map((dataset: Dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              hover:border-primary hover:bg-primary/5`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                {isDragActive ? (
                  <p>Drop the images here ...</p>
                ) : (
                  <p>Drag & drop images here, or click to select files</p>
                )}
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Uploaded files:</div>
              <div className="max-h-[200px] overflow-auto space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm"
                  >
                    <span className="truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.name)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!selectedDataset || files.length === 0 || isLoading}
            onClick={handleUpload}
          >
            {isLoading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NewUploadImagesSheet;
