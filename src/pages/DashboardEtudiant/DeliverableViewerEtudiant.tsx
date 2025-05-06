import React, { useState } from 'react';
import { FileText, Code, Highlighter, MessageSquare } from 'lucide-react';

interface DeliverableViewerProps {
  deliverable: any;
  onAddAnnotation: (text: string) => void;
}

const DeliverableViewerEtudiant: React.FC<DeliverableViewerProps> = ({
  deliverable,
  onAddAnnotation
}) => {
  const [annotationText, setAnnotationText] = useState('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentTool, setCurrentTool] = useState<'text' | 'highlight' | 'comment'>('text');

  // Simuler le contenu du PDF 
  const pdfContent = [{
    id: 1,
    type: 'heading',
    content: 'Rapport d\'Analyse des Besoins'
  }, {
    id: 2,
    type: 'paragraph',
    content: 'Ce document présente l\'analyse détaillée des besoins pour le système de gestion des projets de fin d\'études. Notre équipe a mené une étude approfondie des processus actuels et des exigences des utilisateurs pour concevoir une solution adaptée.'
  }, {
    id: 3,
    type: 'heading2',
    content: '1. Introduction'
  }, {
    id: 4,
    type: 'paragraph',
    content: 'Le système actuel de gestion des PFE présente plusieurs limitations qui affectent l\'efficacité du suivi et de l\'évaluation des projets. Ce document identifie les besoins fonctionnels et non-fonctionnels pour le nouveau système.'
  }, {
    id: 5,
    type: 'heading2',
    content: '2. Besoins Fonctionnels'
  }, {
    id: 6,
    type: 'paragraph',
    content: 'Le système doit permettre aux encadrants de créer et gérer des groupes d\'étudiants, d\'assigner des tâches, de suivre l\'avancement, et d\'évaluer les livrables soumis. Les étudiants doivent pouvoir soumettre leurs travaux et communiquer avec leurs encadrants.'
  }, {
    id: 7,
    type: 'heading2',
    content: '3. Architecture Proposée'
  }, {
    id: 8,
    type: 'paragraph',
    content: 'Nous proposons une architecture client-serveur basée sur React pour le frontend et Node.js pour le backend. Une base de données SQL sera utilisée pour stocker les données structurées des projets, des étudiants et des encadrants.'
  }, {
    id: 9,
    type: 'heading2',
    content: '4. Conclusion'
  }, {
    id: 10,
    type: 'paragraph',
    content: 'Cette analyse des besoins servira de base pour le développement du nouveau système de gestion des PFE, qui améliorera significativement l\'expérience des encadrants et des étudiants.'
  }];
  
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      setShowAnnotationForm(true);
    }
  };
  
  const handleAddAnnotation = () => {
    if (annotationText.trim() === '') return;
    onAddAnnotation(annotationText);
    setAnnotationText('');
    setShowAnnotationForm(false);
    setSelectedText('');
  };
  
  const handleChangeTool = (tool: 'text' | 'highlight' | 'comment') => {
    setCurrentTool(tool);
  };

  // Rendu du contenu en fonction du type de livrable (PDF, code, etc.)
  const renderDeliverableContent = () => {
    if (deliverable.type === 'pdf') {
      return <div className="bg-white rounded-lg shadow-sm border border-green-100 p-8 max-w-4xl mx-auto" onMouseUp={handleTextSelection}>
          {pdfContent.map(item => {
            if (item.type === 'heading') {
              return <h1 key={item.id} className="text-2xl font-bold text-green-900 mb-6 text-center">
                      {item.content}
                    </h1>;
            } else if (item.type === 'heading2') {
              return <h2 key={item.id} className="text-xl font-semibold text-blue-400 mt-6 mb-3">
                      {item.content}
                    </h2>;
            } else {
              return <p key={item.id} className="text-black-700 mb-4 leading-relaxed">
                      {item.content}
                    </p>;
            }
          })}
        </div>;
    } else if (deliverable.type === 'code') {
      return <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
          <div className="bg-green-50 p-3 border-b border-green-100 flex justify-between items-center">
            <span className="font-medium text-green-800">Aperçu du code</span>
            <button className="text-green-600 hover:text-green-800">
              <Code size={18} />
            </button>
          </div>
          <pre className="p-4 overflow-auto text-sm">
            <code className="text-gray-800">
              {`import React, { useState } from 'react';

const DeliverableComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch data from API
    fetchData().then(response => {
      setData(response.data);
    });
  }, []);
  
  return (
    <div className="container">
      <h1>Deliverable Preview</h1>
      <div className="content">
        {data.map(item => (
          <div key={item.id} className="item">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverableComponent;`}
            </code>
          </pre>
        </div>;
    } else {
      return <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-green-100">
          <div className="text-center">
            <FileText size={48} className="text-green-400 mx-auto mb-2" />
            <p className="text-green-700">Type de fichier non supporté pour la prévisualisation</p>
          </div>
        </div>;
    }
  };
  
  return <div className="relative">
      {/* Toolbar for annotation */}
      <div className="bg-white rounded-full shadow-md border border-green-100 p-1 mb-4 inline-flex items-center space-x-1 sticky top-0 z-10">
        <button className={`p-2 rounded-full ${currentTool === 'text' ? 'bg-green-100 text-green-700' : 'text-green-500 hover:bg-green-50'}`} onClick={() => handleChangeTool('text')} title="Mode lecture">
          <FileText size={18} />
        </button>
        
        <button className={`p-2 rounded-full ${currentTool === 'comment' ? 'bg-green-100 text-green-700' : 'text-green-500 hover:bg-green-50'}`} onClick={() => handleChangeTool('comment')} title="Ajouter un commentaire">
          <MessageSquare size={18} />
        </button>
      </div>
      
      {/* Instructions for current tool */}
      <div className="text-xs text-green-500 mb-4">
        {currentTool === 'text' && "Mode lecture : naviguer dans le document"}
        {currentTool === 'highlight' && "Mode surlignage : sélectionnez du texte pour le mettre en évidence"}
        {currentTool === 'comment' && "Mode commentaire : sélectionnez du texte pour ajouter un commentaire"}
      </div>
      
      {renderDeliverableContent()}
      
      {/* Annotation form */}
      {showAnnotationForm && <div className="fixed bottom-10 right-10 bg-white rounded-lg shadow-lg border border-green-200 p-4 w-80 animate-scale-in">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-green-800 mb-1">Ajouter une annotation</h3>
            <p className="text-xs text-green-600 mb-2 italic">Texte sélectionné: "{selectedText}"</p>
          </div>
          <textarea value={annotationText} onChange={e => setAnnotationText(e.target.value)} className="w-full p-2 border border-green-200 rounded-md text-sm mb-3 h-24 focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none" placeholder="Saisissez votre commentaire..." />
          <div className="flex justify-end space-x-2">
            <button onClick={() => setShowAnnotationForm(false)} className="px-3 py-1 text-sm text-green-700 hover:bg-green-50 rounded-md transition-colors">
              Annuler
            </button>
            <button onClick={handleAddAnnotation} className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Ajouter
            </button>
          </div>
        </div>}
    </div>;
};

export default DeliverableViewerEtudiant;
