import React, { useState } from 'react';
import WelcomeDashboard from '../components/pages/WelcomeDashboard';
import PaperMetadataModal from '../components/modals/PaperMetadataModal';
import { useNavigate } from 'react-router-dom';
import { generateQsnId } from '../utils/idGenerator';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  const handleCreateNew = () => {
    setShowMetadataModal(true);
  };

  const handleCreatePaper = (metadata) => {
    const qsnId = generateQsnId(metadata.language);
    navigate(`/qsn/${qsnId}`, { state: { metadata, isNew: true } });
  };

  const handleOpenPaper = (paper) => {
    navigate(`/qsn/${paper.id}`, { state: { paperData: paper.data } });
  };

  return (
    <>
      <WelcomeDashboard
        onCreateNew={handleCreateNew}
        onOpenPaper={handleOpenPaper}
        onCreateLanguagePaper={handleCreateNew}
      />
      <PaperMetadataModal
        isOpen={showMetadataModal}
        onClose={() => setShowMetadataModal(false)}
        onCreatePaper={handleCreatePaper}
      />
    </>
  );
};

export default Dashboard;