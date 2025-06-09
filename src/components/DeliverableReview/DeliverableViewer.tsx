import React, { useEffect, useState } from 'react';
import { getFichierFromDeliverable } from '@/services/EtudiantsService';
import { File ,FileText, ExternalLink} from "lucide-react";
interface DeliverableViewerProps {
  deliverable: any;
}

const DeliverableViewer: React.FC<DeliverableViewerProps> = ({ deliverable }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const blob = await getFichierFromDeliverable(deliverable.id);
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setFileType(blob.type);
      } catch (error) {
        console.error("Erreur lors du chargement du livrable :", error);
      }
    };

    if (deliverable?.id) {
      fetchFile();
    }

    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [deliverable?.id]);

  if (!fileUrl || !fileType) return <p>Chargement du fichier...</p>;

  const isOfficeDocument = (type: string) => {
    return [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ].includes(type);
  };

  const renderFilePreview = () => {
    if (fileType.startsWith('image/')) {
      return <img src={fileUrl} alt="Livrable" className="max-h-[80vh] max-w-full border rounded" />;
    }

    if (fileType === 'application/pdf') {
      return <iframe src={fileUrl} title="PDF Viewer" className="w-full h-[80vh] border rounded" />;
      
    }

    if (fileType === 'text/plain' || fileType === 'text/javascript') {
      return <iframe src={fileUrl} title="Code Viewer" className="w-full h-[80vh] border rounded" />;
    }

    if (isOfficeDocument(fileType)) {

      return (
        <div className="text-center border border-gray-200 rounded-xl p-6 shadow-sm bg-white max-w-md mx-auto">
          <div className="flex justify-center mb-4 text-green-600">
            <File size={32} />
          </div>
          <p className="mb-2 text-gray-700 font-medium">
            Ce fichier ne peut pas être prévisualisé dans l'application.
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Type : <strong>officedocument</strong>
          </p>
          <p className="text-sm text-gray-500">
          Vous pouvez le télécharger.
        </p>
        </div>
      );
      
    }
    

    return (
      <div className="text-center border border-gray-200 rounded-xl p-6 shadow-sm bg-white max-w-md mx-auto">
        <div className="flex justify-center mb-4 text-green-600">
          <File size={32} />
        </div>
        <p className="mb-2 text-gray-700 font-medium">
          Aperçu non disponible pour ce type de fichier : <strong>{fileType}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Vous pouvez le télécharger.
        </p>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex justify-center items-center p-4">
      {renderFilePreview()}
    </div>
  );
};

export default DeliverableViewer;
