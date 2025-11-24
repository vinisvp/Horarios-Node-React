import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { professoresService } from '../../services/api';

/**
 * Componente para gerenciamento de professores
 * @component
 * @returns {JSX.Element} Componente de professores
 */
const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'Ativo',
  });

  /**
   * Carrega a lista de professores
   */
  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await professoresService.listar();
      const data = response.data?.professores || [];
      setProfessores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      setProfessores([]);
      mostrarSnackbar('Erro ao carregar professores', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exibe mensagem no snackbar
   * @param {string} message - Mensagem a ser exibida
   * @param {string} severity - Tipo da mensagem (success, error, warning, info)
   */
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Valida o formato do email
   * @param {string} email - Email a ser validado
   * @returns {boolean} True se o email é válido
   */
  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Valida os dados do formulário
   * @returns {boolean} True se todos os dados são válidos
   */
  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Formata o telefone com máscara
   * @param {string} value - Valor do telefone
   * @returns {string} Telefone formatado
   */
  const formatarTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  /**
   * Abre o dialog para criar/editar professor
   * @param {Object|null} professor - Professor a ser editado ou null para novo
   */
  const abrirDialog = (professor = null) => {
    if (professor) {
      setEditingId(professor._id);
      setFormData({
        nome: professor.nome || '',
        email: professor.email || '',
        telefone: professor.telefone || '',
        status: professor.status || 'Ativo',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        status: 'Ativo',
      });
    }
    setErrors({});
    setDialogOpen(true);
  };

  /**
   * Fecha o dialog
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setErrors({});
  };

  /**
   * Salva o professor (criar ou atualizar)
   */
  const salvarProfessor = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      if (editingId) {
        await professoresService.atualizar(editingId, formData);
        mostrarSnackbar('Professor atualizado com sucesso');
      } else {
        await professoresService.criar(formData);
        mostrarSnackbar('Professor criado com sucesso');
      }
      fecharDialog();
      carregarProfessores();
    } catch (error) {
      let message = 'Erro ao salvar professor';
      
      if (error.response?.status === 409) {
        message = 'Este email já está sendo usado por outro professor';
        setErrors({ email: message });
      } else {
        message = error.response?.data?.message || message;
        mostrarSnackbar(message, 'error');
      }
    }
  };

  /**
   * Remove um professor
   * @param {string} id - ID do professor
   */
  const removerProfessor = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este professor?')) {
      try {
        await professoresService.remover(id);
        mostrarSnackbar('Professor removido com sucesso');
        carregarProfessores();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover professor';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  /**
   * Manipula a ordenação da tabela
   * @param {string} property - Propriedade para ordenar
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * Compara dois valores para ordenação
   * @param {any} a - Primeiro valor
   * @param {any} b - Segundo valor
   * @param {string} orderBy - Propriedade para ordenar
   * @returns {number} Resultado da comparação
   */
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  /**
   * Função de comparação para ordenação
   * @param {string} order - Direção da ordenação (asc/desc)
   * @param {string} orderBy - Propriedade para ordenar
   * @returns {Function} Função de comparação
   */
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  /**
   * Filtra e ordena os professores
   */
  const professoresFiltrados = Array.isArray(professores) ? professores
    .filter((professor) =>
      professor.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      professor.email?.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort(getComparator(order, orderBy)) : [];

  useEffect(() => {
    carregarProfessores();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirDialog()}
          >
            Novo Professor
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar por nome ou email..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nome'}
                  direction={orderBy === 'nome' ? order : 'asc'}
                  onClick={() => handleRequestSort('nome')}
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professoresFiltrados.map((professor) => (
              <TableRow key={professor._id}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.telefone}</TableCell>
                <TableCell>
                  <Typography color={professor.status === 'Ativo' ? 'success.main' : 'error.main'}>
                    {professor.status || 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(professor)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerProfessor(professor._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Professor' : 'Novo Professor'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome *"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              fullWidth
              required
              error={!!errors.nome}
              helperText={errors.nome}
            />
            <TextField
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => {
                const formatted = formatarTelefone(e.target.value);
                setFormData({ ...formData, telefone: formatted });
              }}
              fullWidth
              placeholder="(XX) XXXXX-XXXX"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'Ativo'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Ativo' : 'Inativo' })}
                />
              }
              label="Ativo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarProfessor} variant="contained">
            {editingId ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Professores;