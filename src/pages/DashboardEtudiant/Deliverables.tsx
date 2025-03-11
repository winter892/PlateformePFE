import React, { useState } from 'react';
import { FileText, Plus, Download, Eye, Clock, Calendar, ExternalLink, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
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
    {
      id: '1',
      name: 'Rapport d\'analyse.pdf',
      taskName: 'Analyser les besoins du projet',
      submittedAt: '2023-10-14',
      dueDate: '2023-10-15',
      status: 'accepté',
      fileUrl: '/documents/rapport.pdf',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      comments: 3
    },
    {
      id: '2',
      name: 'Schéma d\'architecture.png',
      taskName: 'Concevoir l\'architecture',
      submittedAt: '2023-10-20',
      dueDate: '2023-10-22',
      status: 'en attente',
      fileUrl: '/documents/schema.png',
      fileSize: '3.5 MB',
      fileType: 'PNG',
      comments: 1
    },
    {
      id: '3',
      name: 'Prototype initial.zip',
      taskName: 'Développer le prototype',
      submittedAt: '2023-11-01',
      dueDate: '2023-11-05',
      status: 'révision requise',
      fileUrl: '/documents/prototype.zip',
      fileSize: '8.7 MB',
      fileType: 'ZIP',
      comments: 5
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isNewDeliverableDialogOpen, setIsNewDeliverableDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof Deliverable, direction: 'asc' | 'desc'} | null>(null);

  const handleSort = (key: keyof Deliverable) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIcon = (key: keyof Deliverable) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sortedDeliverables = [...deliverables].sort((a, b) => {
    if (!sortConfig) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredDeliverables = sortedDeliverables.filter(deliverable => {
    const matchesSearch = deliverable.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deliverable.taskName.toLowerCase().includes(searchQuery.toLowerCase());
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
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 ml-64 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h1 
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Livrables
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsNewDeliverableDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau livrable
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un livrable..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`text-sm ${!selectedStatus ? "bg-green-50 border-green-200 text-green-700" : ""}`}
              onClick={() => setSelectedStatus(null)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
            {['accepté', 'en attente', 'révision requise'].map(status => (
              <Button
                key={status}
                variant="outline"
                className={`text-sm ${selectedStatus === status ? "bg-green-50 border-green-200 text-green-700" : ""}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg border shadow-sm overflow-hidden"
          variants={container}
          initial="hidden"
          animate="show"
        >
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
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDeliverables.length > 0 ? (
                  filteredDeliverables.map((deliverable) => (
                    <motion.tr 
                      key={deliverable.id} 
                      className="hover:bg-gray-50 transition-colors"
                      variants={item}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${getFileIcon(deliverable.fileType)}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{deliverable.name}</div>
                            <div className="text-gray-500 text-xs">{deliverable.fileSize} • {deliverable.fileType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{deliverable.taskName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(deliverable.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                          {deliverable.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewDeliverable(deliverable)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun livrable trouvé</h3>
                      <p className="text-gray-500 mb-4">Essayez de modifier vos filtres ou ajoutez un nouveau livrable</p>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setIsNewDeliverableDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau livrable
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Nouveau livrable dialog */}
      <Dialog open={isNewDeliverableDialogOpen} onOpenChange={setIsNewDeliverableDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Soumettre un nouveau livrable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tâche associée</label>
              <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                <option value="">Sélectionner une tâche</option>
                <option value="1">Analyser les besoins du projet</option>
                <option value="2">Concevoir l'architecture</option>
                <option value="3">Développer le prototype</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du livrable</label>
              <Input placeholder="Titre descriptif pour ce livrable" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optionnelle)</label>
              <textarea 
                className="w-full rounded-md border border-gray-300 p-2 text-sm min-h-[100px]"
                placeholder="Décrivez brièvement ce livrable"
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fichier</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <div className="text-sm text-gray-500 mb-2">
                  Glissez votre fichier ici ou
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Parcourir les fichiers
                </Button>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewDeliverableDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
            >
              Soumettre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDeliverable?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
            <div>
              <div className="bg-gray-100 p-4 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Aperçu du document</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ouvrir le fichier
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Tâche associée</div>
                  <div className="font-medium">{selectedDeliverable?.taskName}</div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Date de soumission</div>
                    <div className="font-medium">{selectedDeliverable ? new Date(selectedDeliverable.submittedAt).toLocaleDateString() : ''}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date d'échéance</div>
                    <div className="font-medium">{selectedDeliverable ? new Date(selectedDeliverable.dueDate).toLocaleDateString() : ''}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Statut</div>
                    <div>
                      {selectedDeliverable && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDeliverable.status)}`}>
                          {selectedDeliverable.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Discussion</h3>
              <div className="border rounded-lg p-3 h-64 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      P
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm max-w-[80%]">
                      <p className="text-sm">Pouvez-vous ajouter plus de détails à cette section ?</p>
                      <span className="text-xs text-gray-500">14:30</span>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-green-100 p-2 rounded-lg shadow-sm max-w-[80%]">
                      <p className="text-sm">Oui, je vais l'améliorer et soumettre une nouvelle version.</p>
                      <span className="text-xs text-gray-500">14:35</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                      E
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      P
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm max-w-[80%]">
                      <p className="text-sm">Merci, j'attends la nouvelle version.</p>
                      <span className="text-xs text-gray-500">15:10</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-3">
                <Input placeholder="Écrire un message..." className="rounded-r-none" />
                <Button className="rounded-l-none bg-green-600 hover:bg-green-700">
                  Envoyer
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-3">Historique des versions</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                    <div className="flex items-center">
                      <div className="bg-gray-200 p-1 rounded mr-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Version 1.0</div>
                        <div className="text-xs text-gray-500">14 Oct, 2023 - 10:30</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deliverables;
