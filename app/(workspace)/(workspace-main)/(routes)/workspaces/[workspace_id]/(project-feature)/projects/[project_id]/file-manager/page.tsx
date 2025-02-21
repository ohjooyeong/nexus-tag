'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FolderIcon, FileIcon, TrashIcon } from 'lucide-react';
import DatasetFileManager from './_components/file-manager';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
}

export default function FileManagerPage() {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  const createNewItem = (type: 'file' | 'folder') => {
    if (!newItemName) return;

    const newItem: FileSystemItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      type,
    };

    setItems([...items, newItem]);
    setNewItemName('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="flex items-center text-2xl font-bold">File Manager</h1>
        </div>

        <DatasetFileManager />
      </div>
    </div>
  );
}
