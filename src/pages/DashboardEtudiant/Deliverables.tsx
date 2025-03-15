import React, { useState } from 'react';
import { FileText, Plus, Download, Eye, Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from 'framer-motion';

interface Deliverable {
  id: string;
  name: string;
  taskName: string;
  submittedAt: string;
  dueDate: string;
  status: 'accepté' | 'en attente' | 'révision requise';
  fileUrl: string;
  fileSize: string;
  fileType: string;
  comments: number;
}

const Deliverables = () => {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', name: 'Rapport d\'analyse.pdf', taskName: 'Analyser les besoins du projet', submittedAt: '2023-10-14', dueDate: '2023-10-15', status: 'accepté', fileUrl: '/documents/rapport.pdf', fileSize: '1.2 MB', fileType: 'PDF', comments: 3 },
    { id: '2', name: 'Schéma d\'architecture.png', taskName: 'Concevoir l\'architecture', submittedAt: '2023-10-20', dueDate: '2023-10-22', status: 'en attente', fileUrl: '/documents/schema.png', fileSize: '3.5 MB', fileType: 'PNG', comments: 1 },
    { id: '3', name: 'Prototype initial.zip', taskName: 'Développer le prototype', submittedAt: '2023-11-01', dueDate: '2023-11-05', status: 'révision requise', fileUrl: '/documents/prototype.zip', fileSize: '8.7 MB', fileType: 'ZIP', comments: 5 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isNewDeliverableDialogOpen, setIsNewDeliverableDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Deliverable, direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Deliverable) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIcon = (key: keyof Deliverable) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sortedDeliverables = [...deliverables].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredDeliverables = sortedDeliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchQuery.toLowerCase()) || deliverable.taskName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || deliverable.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDeliverable = (deliverable: Deliverable) => {
    setSelectedDeliverable(deliverable);
    setIsPreviewOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepté': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'révision requise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return "bg-red-50 text-red-500";
      case 'png':
      case 'jpg':
      case 'jpeg': return "bg-purple-50 text-purple-500";
      case 'zip': return "bg-yellow-50 text-yellow-500";
      case 'doc':
      case 'docx': return "bg-blue-50 text-blue-500";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-6 ml-64 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h1 className="text-3xl font-bold text-gray-800" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            Livrables
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsNewDeliverableDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau livrable
            </Button>
          </motion.div>
        </div>

        <motion.div className="flex flex-col md:flex-row gap-4 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="relative flex-1">
            <Input type="text" placeholder="Rechercher un livrable..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className={`text-sm ${!selectedStatus ? "bg-green-50 border-green-200 text-green-700" : ""}`} onClick={() => setSelectedStatus(null)}>
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
            {['accepté', 'en attente', 'révision requise'].map(status => (
              <Button key={status} variant="outline" className={`text-sm ${selectedStatus === status ? "bg-green-50 border-green-200 text-green-700" : ""}`} onClick={() => setSelectedStatus(status)}>
                {status}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-lg border shadow-sm overflow-hidden" variants={container} initial="hidden" animate="show">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3 text-left" onClick={() => handleSort('name')}>
                    <div className="flex items-center cursor-pointer">
                      Nom du fichier
                      {getSortDirectionIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left" onClick={() => handleSort('taskName')}>
                    <div className="flex items-center cursor-pointer">
                      Tâche associée
                      {getSortDirectionIcon('taskName')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left" onClick={() => handleSort('submittedAt')}>
                    <div className="flex items-center cursor-pointer">
                      Date de soumission
                      {getSortDirectionIcon('submittedAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left" onClick={() => handleSort('status')}>
                    <div className="flex items-center cursor-pointer">
                      Statut
                      {getSortDirectionIcon('status')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliverables.map(deliverable => (
                  <motion.tr key={deliverable.id} className="text-sm text-gray-700 border-b" variants={item}>
                    <td className="px-6 py-4">{deliverable.name}</td>
                    <td className="px-6 py-4">{deliverable.taskName}</td>
                    <td className="px-6 py-4">{deliverable.submittedAt}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(deliverable.status)}`}>
                        {deliverable.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" className="text-blue-600" onClick={() => handleViewDeliverable(deliverable)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {isPreviewOpen && selectedDeliverable && (
        <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDeliverable.name}</DialogTitle>
            </DialogHeader>
            <div>
              <p><strong>Tâche associée: </strong>{selectedDeliverable.taskName}</p>
              <p><strong>Date de soumission: </strong>{selectedDeliverable.submittedAt}</p>
              <p><strong>Date limite: </strong>{selectedDeliverable.dueDate}</p>
              <p><strong>Statut: </strong>{selectedDeliverable.status}</p>
              <p><strong>Commentaires: </strong>{selectedDeliverable.comments}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Deliverables;
