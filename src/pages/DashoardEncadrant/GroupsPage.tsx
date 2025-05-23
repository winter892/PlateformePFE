import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { groups, projects, tasks } from '@/lib/mock-data';
import { Group, Project, Task } from '@/types';
import GroupItem from '@/components/GroupItem';
import { Plus, X, Printer, FileText, Users, CheckSquare, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import {getUserById} from '@/services/userService';

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const user= localStorage.getItem('id');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupDetailModal, setShowGroupDetailModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [nextGroupNumber, setNextGroupNumber] = useState(groups.length + 1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showStudentSelectionModal, setShowStudentSelectionModal] = useState(false);
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [deliverableSearchTerm, setDeliverableSearchTerm] = useState('');
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);
  const [newGroupName, setNewGroupName] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState('');
  const [encadrantFiliereId, setEncadrantFiliereId] = useState<number | null>(null);

  // Récupérer les informations de l'encadrant
  useEffect(() => {
    const fetchEncadrantData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/UserById/${user}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erreur de récupération des données encadrant');
        
        const data = await response.json();
        setEncadrantFiliereId(data.filiere?.id);
      } catch (error) {
        console.error("Erreur récupération encadrant:", error);
        toast.error("Erreur de chargement des informations encadrant");
      }
    };

    if (user) fetchEncadrantData();
  }, [user]);

  // Récupérer les étudiants de la filière
  useEffect(() => {
    const fetchStudents = async () => {
      if (!encadrantFiliereId) return;

      setLoadingStudents(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/Etudiants/${encadrantFiliereId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erreur de récupération étudiants');
        
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setErrorStudents('Erreur lors du chargement des étudiants');
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [encadrantFiliereId]);

  const toggleStudentSelection = (student: any) => {
    const fullName = `${student.nom} ${student.prenom}`;
    if (selectedStudents.includes(fullName)) {
      setSelectedStudents(selectedStudents.filter(s => s !== fullName));
    } else {
      setSelectedStudents([...selectedStudents, fullName]);
    }
  };

  const getProjectForGroup = (groupId: number): Project => {
    return projects.find(p => p.groupId === groupId) || projects[0];
  };

  const getTasksForProject = (projectId: number): Task[] => {
    return tasks.filter(t => t.projectId === projectId);
  };

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupDetailModal(true);
  };

  const handleTasksClick = (groupId: number) => {
    setSelectedGroupId(groupId);
    setShowTasksModal(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const handleCreateGroup = () => {
    if (!newGroupName || selectedStudents.length === 0 || !newProjectTitle) {
      toast.error("Veuillez remplir tous les champs et sélectionner au moins un membre");
      return;
    }

    const newGroup: Group = {
      id: localGroups.length + 1,
      intitule: newGroupName,
      members: selectedStudents,
    };

    const newProject: Project = {
      id: projects.length + 1,
      groupId: newGroup.id,
      titre: newProjectTitle,
      description: "Nouveau projet créé avec le groupe",
      progress: 0
    };

    setLocalGroups([...localGroups, newGroup]);
    projects.push(newProject);

    setShowCreateModal(false);
    setNewGroupName('');
    setNewProjectTitle('');
    setSelectedStudents([]);
    setNextGroupNumber(nextGroupNumber + 1);
    toast.success("Groupe créé avec succès!");
  };

  const handlePrintGroupsList = () => {
    console.log('Printing groups list');
    toast.info("Impression de la liste des groupes en cours...");
  };

  const navigateToDeliverable = (groupId: number, taskId: number, deliverableId: number) => {
    navigate(`/groups/${groupId}/tasks/${taskId}/deliverables/${deliverableId}`);
    setShowTaskDetailModal(false);
  };

  const filterTasks = (tasks: Task[]) => {
    if (!taskSearchTerm) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(taskSearchTerm.toLowerCase())
    );
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-violet-900">Gestion des Groupes</h1>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors" onClick={handlePrintGroupsList}>
            <Printer size={18} className="mr-2" />
            Imprimer la liste
          </button>
          <button className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} className="mr-2" />
            Créer un groupe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localGroups.map(group => (
          <GroupItem 
            key={group.id} 
            group={group} 
            project={getProjectForGroup(group.id)} 
            tasks={getTasksForProject(getProjectForGroup(group.id).id)} 
            onClick={handleGroupClick} 
            onTasksClick={handleTasksClick} 
          />
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">Créer un nouveau groupe</h2>
                <button className="text-violet-500 hover:text-violet-700" onClick={() => setShowCreateModal(false)}>
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
                    Membres
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedStudents.map((student, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                        {student}
                        <button className="ml-1 text-green-600 hover:text-green-800" onClick={() => setSelectedStudents(selectedStudents.filter(s => s !== student))}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
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
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-colors" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroupName('');
                    setNewProjectTitle('');
                    setSelectedStudents([]);
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors" 
                  onClick={handleCreateGroup}
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Selection Modal */}
      {showStudentSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">Sélectionner Membres</h2>
                <button className="text-violet-500 hover:text-violet-700" onClick={() => setShowStudentSelectionModal(false)}>
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
                  <div className="p-4 text-center text-violet-600">Chargement des étudiants...</div>
                ) : errorStudents ? (
                  <div className="p-4 text-center text-red-600">{errorStudents}</div>
                ) : (
                  <div className="divide-y divide-violet-100">
                    <div className="py-2 flex items-center justify-between font-medium text-violet-700 border-b border-violet-200">
                      <span>Nom</span>
                      <span>Code APOGE</span>
                    </div>
                    {students.map((student, index) => (
                      <div 
                        key={index} 
                        className={`py-3 px-2 flex items-center justify-between rounded-lg cursor-pointer ${selectedStudents.includes(`${student.nom} ${student.prenom}`) ? 'bg-green-50' : 'hover:bg-violet-50'}`} 
                        onClick={() => toggleStudentSelection(student)}
                      >
                        <span className={selectedStudents.includes(`${student.nom} ${student.prenom}`) ? 'text-green-800' : 'text-violet-800'}>
                          {student.nom} {student.prenom}
                        </span>
                        <div className="flex items-center">
                          <span className="text-violet-600 mr-3">{student.code_APOGEE}</span>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedStudents.includes(`${student.nom} ${student.prenom}`) ? 'border-green-500 bg-green-100' : 'border-violet-300'}`}>
                            {selectedStudents.includes(`${student.nom} ${student.prenom}`) && <div className="w-3 h-3 bg-green-500 rounded-sm"></div>}
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
      {/* Group Detail Modal */}
      {showGroupDetailModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">Détail du sujet</h2>
                <button className="text-violet-500 hover:text-violet-700" onClick={() => setShowGroupDetailModal(false)}>
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
                    {selectedGroup.members.map((member, index) => (
                      <span key={index} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-violet-700 mb-1">Projet</h3>
                  <p className="text-violet-900">{getProjectForGroup(selectedGroup.id).titre}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-violet-700 mb-1">Description</h3>
                  <p className="text-violet-700">{getProjectForGroup(selectedGroup.id).description}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-violet-700 mb-1">Progression</h3>
                  <div className="w-full bg-violet-100 rounded-full h-2 mb-1">
                    <div 
                      className="bg-violet-500 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${getProjectForGroup(selectedGroup.id).progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-violet-500">{getProjectForGroup(selectedGroup.id).progress}% complété</p>
                </div>
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
      
      {/* Tasks Modal */}
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
                  Tâches - {localGroups.find(g => g.id === selectedGroupId)?.intitule}
                </h2>
                <button className="text-violet-500 hover:text-violet-700" onClick={() => setShowTasksModal(false)}>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filterTasks(getTasksForProject(getProjectForGroup(selectedGroupId).id)).map(task => (
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
                        {task.status === 'completed' ? 'Terminée' : task.status === 'problem' ? 'Problème' : 'En cours'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-violet-600 mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-violet-500">
                      {/* Additional task info if needed */}
                    </div>
                  </div>
                ))}
              </div>
              
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
      
      {/* Task Detail Modal */}
      {showTaskDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button 
                onClick={() => {setShowTaskDetailModal(false); setShowTasksModal(true); }} 
                className="mb-8 flex items-center p-2 rounded-md transition hover:bg-violet-100"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Retour
              </button>
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-violet-900">{selectedTask.title}</h2>
                <button className="text-violet-500 hover:text-violet-700" onClick={() => setShowTaskDetailModal(false)}>
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
                  
                  {/* Mock deliverables */}
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
                      <p className="text-xs text-violet-500">Soumis le: 15/04/2025</p>
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
                      <p className="text-xs text-violet-500">Date limite: 22/04/2025</p>
                    </div>
                    
                    <div 
                      className="border border-violet-200 rounded-lg p-4 hover:bg-violet-50 transition-colors cursor-pointer" 
                      onClick={() => navigateToDeliverable(selectedGroupId || 1, selectedTask.id, 3)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <FileText size={18} className="text-violet-600 mr-2" />
                          <h4 className="font-medium text-violet-800">Prototype d'interface</h4>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">En retard</span>
                      </div>
                      <p className="text-sm text-violet-600 mb-2">Maquettes des interfaces utilisateur</p>
                      <p className="text-xs text-violet-500">Date limite: 10/04/2025</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-violet-100">
                <button 
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors" 
                  onClick={() => setShowTaskDetailModal(false)}
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