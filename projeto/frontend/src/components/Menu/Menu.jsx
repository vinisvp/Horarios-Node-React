import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Modal,
  IconButton,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Instituicoes from '../Instituicoes/Instituicoes';
import Cursos from '../Cursos/Cursos';
import Professores from '../Professores/Professores';

/**
 * Componente de menu lateral da aplicação
 * @component
 * @param {Object} props - Props do componente
 * @param {boolean} props.open - Estado de abertura do menu
 * @param {Function} props.onClose - Função para fechar o menu
 * @returns {JSX.Element} Componente de menu
 */
const Menu = ({ open, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  /**
   * Abre modal com conteúdo específico
   * @param {string} title - Título do modal
   * @param {JSX.Element} content - Conteúdo do modal
   */
  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
    onClose();
  };

  /**
   * Fecha o modal
   */
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  /**
   * Manipula clique no menu de instituições
   */
  const handleInstituicoesClick = () => {
    handleOpenModal('Gerenciar Instituições', <Instituicoes />);
  };

  /**
   * Manipula clique no menu de cursos
   */
  const handleCursosClick = () => {
    handleOpenModal('Gerenciar Cursos', <Cursos />);
  };

  /**
   * Manipula clique no menu de professores
   */
  const handleProfessoresClick = () => {
    handleOpenModal('Gerenciar Professores', <Professores />);
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2, backgroundColor: '#1976d2', color: 'white' }}>
            <Typography variant="h6">
              Menu Principal
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleInstituicoesClick}>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Instituições" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCursosClick}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Cursos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProfessoresClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Professores" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '1200px',
            height: '90%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6">
              {modalTitle}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {modalContent}
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button onClick={handleCloseModal} variant="contained">
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Menu;