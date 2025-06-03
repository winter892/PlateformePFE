import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import GroupItem from '@/components/GroupItem';
import { Plus, X, Printer, FileText, Users, CheckSquare, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getTaches,
  getTacheStats
} from '@/services/EtudiantsService';
import { 
  getGroupesByFiliere,
  getEtudiants,
  getEtudiantsByGroupe,
} from '@/services/userService';
import { Group, Project, Task } from '@/types';

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');
  
  // États principaux
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupDetailModal, setShowGroupDetailModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showStudentSelectionModal, setShowStudentSelectionModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState('');
  const [encadrantFiliereId, setEncadrantFiliereId] = useState<number | null>(null);
  const [encadrantId, setEncadrantId] = useState<number | null>(null);
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [deliverableSearchTerm, setDeliverableSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage] = useState(6);
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer les informations de l'encadrant
  useEffect(() => {
    const fetchEncadrantData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/UserById/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erreur de récupération des données encadrant');
        
        const data = await response.json();
        setEncadrantFiliereId(data.filiere?.id);
        setEncadrantId(data.id);
      } catch (error) {
        console.error("Erreur récupération encadrant:", error);
        toast.error("Erreur de chargement des informations encadrant");
      }
    };

    if (userId) fetchEncadrantData();
  }, [userId]);

  // Récupérer les groupes de la filière
  useEffect(() => {
    const fetchGroups = async () => {
      if (!encadrantFiliereId) return;
      
      setIsLoadingGroups(true);
      try {
        const groupsData = await getGroupesByFiliere(encadrantFiliereId);
        
        const groupsWithStats = await Promise.all(groupsData.map(async (group: any) => {
          try {
            const stats = await getTacheStats(group.projet.id);
            
            const progress = stats.pourcentageTermine || 0;
            let status: 'in_progress' | 'completed' | 'pending' = 'pending';
            
            if (progress === 0) {
              status = 'pending';
            } else if (progress < 100) {
              status = 'in_progress';
            } else {
              status = 'completed';
            }
            
            const members = await getEtudiantsByGroupe(group.id);
            const memberNames = members.map((m: any) => `${m.nom} ${m.prenom}`);
            
            return {
              ...group,
              project: group.projet,
              members: memberNames,
              progress,
              status
            };
          } catch (error) {
            console.error("Erreur récupération stats:", error);
            return {
              ...group,
              project: group.projet,
              progress: 0,
              status: 'pending'
            };
          }
        }));
        
        setGroups(groupsWithStats);
      } catch (error) {
        console.error("Erreur récupération groupes:", error);
        toast.error("Erreur de chargement des groupes");
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [encadrantFiliereId]);

  // Récupérer les étudiants de la filière
  useEffect(() => {
    const fetchStudents = async () => {
      if (!encadrantFiliereId) return;

      setLoadingStudents(true);
      try {
        const studentsData = await getEtudiants(encadrantFiliereId);
        setStudents(studentsData);
      } catch (err) {
        setErrorStudents('Erreur lors du chargement des étudiants');
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [encadrantFiliereId]);

  // Filtrer les groupes
  const filteredGroups = groups.filter(group => {
    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;
    const matchesSearch = group.intitule.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (group.projet?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  // Fonction pour basculer la sélection d'un étudiant
  const toggleStudentSelection = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Fonction pour créer un nouveau groupe avec projet
  const handleCreateGroup = async () => {
    if (!newGroupName || selectedStudents.length === 0 || !newProjectTitle || !encadrantFiliereId || !encadrantId) {
      toast.error("Veuillez remplir tous les champs et sélectionner au moins un membre");
      return;
    }

    setIsCreatingGroup(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/groupe/createWithProject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          groupName: newGroupName,
          projectTitle: newProjectTitle,
          projectDescription: newProjectDescription || "Nouveau projet créé avec le groupe",
          filiereId: encadrantFiliereId,
          encadrantId: encadrantId,
          studentIds: selectedStudents
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du groupe');
      }
      
      const newGroup = await response.json();
      
      // Ajouter le nouveau groupe à la liste
      setGroups(prevGroups => [
        ...prevGroups,
        {
          ...newGroup,
          project: newGroup.projet,
          members: students
            .filter(s => selectedStudents.includes(s.id))
            .map(s => `${s.nom} ${s.prenom}`),
          progress: 0,
          status: 'pending'
        }
      ]);
      
      // Réinitialiser les états
      setShowCreateModal(false);
      setNewGroupName('');
      setNewProjectTitle('');
      setNewProjectDescription('');
      setSelectedStudents([]);
      setCurrentPage(1);
      
      toast.success("Groupe créé avec succès!");
    } catch (error) {
      console.error("Erreur création groupe:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création du groupe");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Autres fonctions utilitaires
  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupDetailModal(true);
  };

  const handleTasksClick = async (groupId: number) => {
    setSelectedGroupId(groupId);
    setShowTasksModal(true);
    
    const group = groups.find(g => g.id === groupId);
    if (group?.projet?.id) {
      const tasks = await getTasksForProject(group.projet.id);
      setTasks(tasks);
    }
  };

  const getTasksForProject = async (projectId: number) => {
    setIsLoadingTasks(true);
    try {
      const group = groups.find(g => g.projet?.id === projectId);
      if (!group) return [];

      const allTasks: Task[] = [];
      const members = await getEtudiantsByGroupe(group.id);
      
      for (const member of members) {
        const tasks = await getTaches(member.id);
        allTasks.push(...tasks);
      }

      return allTasks;
    } catch (error) {
      console.error("Erreur récupération tâches:", error);
      return [];
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const filterTasks = (tasks: Task[]) => {
    if (!taskSearchTerm) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) || 
      (task.description?.toLowerCase().includes(taskSearchTerm.toLowerCase()) ?? false)
    );
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handlePrintGroupsList = () => {
    console.log('Printing groups list');
    toast.info("Impression de la liste des groupes en cours...");
  };

  const navigateToDeliverable = (groupId: number, taskId: number, deliverableId: number) => {
    navigate(`/groups/${groupId}/tasks/${taskId}/deliverables/${deliverableId}`);
    setShowTasksModal(false);
  };

  // Composant de pagination
  const Pagination = () => (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-l-md border border-violet-300 bg-white text-violet-600 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border-t border-b border-violet-300 ${currentPage === page ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-r-md border border-violet-300 bg-white text-violet-600 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </nav>
    </div>
  );

  return (
    <DashboardLayout>
      {/* En-tête avec boutons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-violet-900">Gestion des Groupes</h1>
        <div className="flex gap-3">
          <button 
            className="flex items-center px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors" 
            onClick={handlePrintGroupsList}
          >
            <Printer size={18} className="mr-2" />
            Imprimer la liste
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors" 
            onClick={() => setShowCreateModal(true)}
            disabled={isCreatingGroup}
          >
            {isCreatingGroup ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Création...
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                Créer un groupe
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-violet-100">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom de groupe ou projet..."
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-violet-700">Statut :</label>
            <select
              className="px-3 py-2 border border-violet-200 rounded-lg focus:ring-violet-300 focus:border-violet-500 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">Tous</option>
              <option value="pending">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Nombre de résultats */}
      <div className="text-sm text-violet-600 mb-4">
        {filteredGroups.length} groupe(s) trouvé(s)
      </div>

      {/* Chargement */}
      {isLoadingGroups && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin text-violet-600 mr-2" size={24} />
          <span>Chargement des groupes...</span>
        </div>
      )}

      {/* Grille des groupes */}
      {!isLoadingGroups && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGroups.map(group => (
              <GroupItem 
                key={group.id} 
                group={group} 
                project={group.projet || { id: 0, titre: '', description: '', progress: 0, status: 'in_progress', groupId: 0, lastUpdated: '' }}
                progress={group.progress}
                status={group.status as 'in_progress' | 'completed' | 'pending'}
                onClick={() => handleGroupClick(group)} 
                onTasksClick={() => handleTasksClick(group.id)} 
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredGroups.length > groupsPerPage && <Pagination />}
        </>
      )}

      {/* Empty State */}
      {!isLoadingGroups && filteredGroups.length === 0 && (
        <div className="text-center text-violet-600 py-8">
          <FileText className="mx-auto mb-4" size={48} />
          <p className="text-lg">Aucun groupe trouvé</p>
          <p className="text-sm">Essayez de modifier vos filtres ou de créer un nouveau groupe.</p>
        </div>
      )}

      {/* Modal de création de groupe */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">Créer un nouveau groupe</h2>
                <button 
                  className="text-violet-500 hover:text-violet-700" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroupName('');
                    setNewProjectTitle('');
                    setNewProjectDescription('');
                    setSelectedStudents([]);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-1">
                    Nom du groupe
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" 
                    placeholder="Nom du groupe"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-1">
                    Membres ({selectedStudents.length} sélectionnés)
                  </label>
                  <button 
                    className="w-full p-2 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-colors flex items-center justify-center" 
                    onClick={() => setShowStudentSelectionModal(true)}
                  >
                    <Users size={18} className="mr-2" />
                    Sélectionner Membres
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-1">
                    Sujet de PFE
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" 
                    placeholder="Intitulé du projet" 
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-1">
                    Description du projet (optionnel)
                  </label>
                  <textarea 
                    className="w-full p-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" 
                    placeholder="Description du projet..."
                    rows={3}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-colors" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroupName('');
                    setNewProjectTitle('');
                    setNewProjectDescription('');
                    setSelectedStudents([]);
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors" 
                  onClick={handleCreateGroup}
                  disabled={isCreatingGroup}
                >
                  {isCreatingGroup ? (
                    <>
                      <Loader2 className="animate-spin inline mr-2" size={18} />
                      Création...
                    </>
                  ) : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sélection des étudiants */}
      {showStudentSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">Sélectionner Membres</h2>
                <button 
                  className="text-violet-500 hover:text-violet-700" 
                  onClick={() => setShowStudentSelectionModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Rechercher un membre..." 
                  className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none" 
                />
              </div>
              
              <div className="mb-6">
                {loadingStudents ? (
                  <div className="p-4 text-center text-violet-600">
                    <Loader2 className="animate-spin inline mr-2" />
                    Chargement des étudiants...
                  </div>
                ) : errorStudents ? (
                  <div className="p-4 text-center text-red-600">{errorStudents}</div>
                ) : (
                  <div className="divide-y divide-violet-100">
                    <div className="py-2 flex items-center justify-between font-medium text-violet-700 border-b border-violet-200">
                      <span>Nom</span>
                      <span>Code APOGE</span>
                    </div>
                    {students.map((student) => (
                      <div 
                        key={student.id} 
                        className={`py-3 px-2 flex items-center justify-between rounded-lg cursor-pointer ${
                          selectedStudents.includes(student.id) ? 'bg-green-50' : 'hover:bg-violet-50'
                        }`} 
                        onClick={() => toggleStudentSelection(student.id)}
                      >
                        <span className={selectedStudents.includes(student.id) ? 'text-green-800' : 'text-violet-800'}>
                          {student.nom} {student.prenom}
                        </span>
                        <div className="flex items-center">
                          <span className="text-violet-600 mr-3">{student.codeApogee}</span>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedStudents.includes(student.id) ? 'border-green-500 bg-green-100' : 'border-violet-300'
                          }`}>
                            {selectedStudents.includes(student.id) && <div className="w-3 h-3 bg-green-500 rounded-sm"></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors" 
                  onClick={() => setShowStudentSelectionModal(false)}
                >
                  Confirmer ({selectedStudents.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail du groupe */}
      {showGroupDetailModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">Détail du groupe</h2>
                <button 
                  className="text-violet-500 hover:text-violet-700" 
                  onClick={() => setShowGroupDetailModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-violet-700 mb-1">Groupe</h3>
                  <p className="text-violet-900">{selectedGroup.intitule}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-violet-700 mb-1">Membres</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroup.members?.map((member, index) => (
                      <span key={index} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedGroup.projet && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-violet-700 mb-1">Projet</h3>
                      <p className="text-violet-900">{selectedGroup.projet.titre}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-violet-700 mb-1">Description</h3>
                      <p className="text-violet-700">{selectedGroup.projet.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-violet-700 mb-1">Progression</h3>
                      <div className="w-full bg-violet-100 rounded-full h-2 mb-1">
                        <div 
                          className="bg-violet-500 h-2 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${selectedGroup.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-violet-500">{selectedGroup.progress}% complété</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-violet-100">
                <button 
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors" 
                  onClick={() => setShowGroupDetailModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal des tâches */}
      {showTasksModal && selectedGroupId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button 
                onClick={() => setShowTasksModal(false)} 
                className="mb-8 flex items-center p-2 rounded-md transition hover:bg-violet-100"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Retour
              </button>
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">
                  Tâches - {groups.find(g => g.id === selectedGroupId)?.intitule}
                </h2>
                <button 
                  className="text-violet-500 hover:text-violet-700" 
                  onClick={() => setShowTasksModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-violet-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Rechercher des tâches..." 
                  className="w-full pl-10 pr-4 py-2 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none"
                  value={taskSearchTerm}
                  onChange={(e) => setTaskSearchTerm(e.target.value)}
                />
              </div>
              
              {isLoadingTasks ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin text-violet-600 mr-2" size={24} />
                  <span>Chargement des tâches...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {filterTasks(tasks).map(task => (
                    <div 
                      key={task.id} 
                      className="bg-white rounded-lg p-4 border border-violet-200 hover:shadow-md transition-shadow cursor-pointer" 
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-violet-800">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          task.status === 'problem' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {task.status === 'completed' ? 'Terminée' : task.status === 'problem' ? 'En retard' : 'En cours'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-violet-600 mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex justify-between items-center text-xs text-violet-500">
                        <span>Date limite: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors" 
                  onClick={() => setShowTasksModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de détail de tâche */}
      {showTasksModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button 
                onClick={() => { setSelectedTask(null); }} 
                className="mb-8 flex items-center p-2 rounded-md transition hover:bg-violet-100"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Retour
              </button>
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">{selectedTask.title}</h2>
                <button 
                  className="text-violet-500 hover:text-violet-700" 
                  onClick={() => setSelectedTask(null)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-violet-700 mb-4">{selectedTask.description}</p>
                
                <div className="mb-4">
                  <h3 className="text-md font-medium text-violet-800 mb-3">Livrables</h3>
                  
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-violet-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Rechercher des livrables..." 
                      className="w-full pl-10 pr-4 py-2 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none"
                      value={deliverableSearchTerm}
                      onChange={(e) => setDeliverableSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Exemple de livrables */}
                  <div className="space-y-4">
                    <div 
                      className="border border-violet-200 rounded-lg p-4 hover:bg-violet-50 transition-colors cursor-pointer" 
                      onClick={() => navigateToDeliverable(selectedGroupId || 1, selectedTask.id, 1)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <FileText size={18} className="text-violet-600 mr-2" />
                          <h4 className="font-medium text-violet-800">Rapport d'analyse</h4>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Soumis</span>
                      </div>
                      <p className="text-sm text-violet-600 mb-2">Document d'analyse des besoins et spécifications</p>
                      <p className="text-xs text-violet-500">Soumis le: {new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div 
                      className="border border-violet-200 rounded-lg p-4 hover:bg-violet-50 transition-colors cursor-pointer" 
                      onClick={() => navigateToDeliverable(selectedGroupId || 1, selectedTask.id, 2)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <FileText size={18} className="text-violet-600 mr-2" />
                          <h4 className="font-medium text-violet-800">Diagramme de classes</h4>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">En attente</span>
                      </div>
                      <p className="text-sm text-violet-600 mb-2">Modélisation UML des classes du système</p>
                      <p className="text-xs text-violet-500">Date limite: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-violet-100">
                <button 
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors" 
                  onClick={() => setSelectedTask(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default GroupsPage;