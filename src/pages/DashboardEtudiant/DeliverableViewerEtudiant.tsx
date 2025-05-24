import React, { useEffect, useState } from 'react';
import { getFichierFromDeliverable } from '@/services/EtudiantsService';

interface DeliverableViewerProps {
  deliverable: any;
}

const DeliverableViewerEtudiant: React.FC<DeliverableViewerProps> = ({ deliverable }) => {
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
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Ce fichier est un document Office. Cliquez ci-dessous pour le visualiser :
          </p>
          <a
            href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + fileUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ouvrir avec Office Online
          </a>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="mb-4 text-gray-600">
          Aperçu non disponible pour ce type de fichier (<strong>{fileType}</strong>).
        </p>
        <a
          href={fileUrl}
          download={deliverable.name || 'livrable'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Télécharger le livrable
        </a>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex justify-center items-center p-4">
      {renderFilePreview()}
    </div>
  );
};

export default DeliverableViewerEtudiant;
