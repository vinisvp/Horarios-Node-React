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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { cursosService, instituicoesService } from '../../services/api';

/**
 * Componente para gerenciamento de cursos
 * @component
 * @returns {JSX.Element} Componente de cursos
 */
const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    nome: '',
    instituicaoId: '',
    turnos: [],
    ativo: true,
  });

  const turnosDisponiveis = ['Manhã', 'Tarde', 'Noite', 'Integral'];

  /**
   * Carrega a lista de cursos
   */
  const carregarCursos = async () => {
    setLoading(true);
    try {
      const response = await cursosService.listar();
      setCursos(response.data.cursos || response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      mostrarSnackbar('Erro ao carregar cursos', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega a lista de instituições
   */
  const carregarInstituicoes = async () => {
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
      mostrarSnackbar('Erro ao carregar instituições', 'error');
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
   * Abre o dialog para criar/editar curso
   * @param {Object|null} curso - Curso para edição ou null para criação
   */
  const abrirDialog = (curso = null) => {
    if (curso) {
      setEditingId(curso._id);
      setFormData({
        nome: curso.nome || '',
        instituicaoId: curso.instituicaoId?._id || curso.instituicaoId || '',
        turnos: curso.turnos || [],
        ativo: curso.ativo !== undefined ? curso.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        instituicaoId: '',
        turnos: [],
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  /**
   * Fecha o dialog
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  /**
   * Salva o curso (criar ou atualizar)
   */
  const salvarCurso = async () => {
    if (!formData.nome.trim() || !formData.instituicaoId) {
      mostrarSnackbar('Nome e instituição são obrigatórios', 'error');
      return;
    }

    try {
      if (editingId) {
        await cursosService.atualizar(editingId, formData);
        mostrarSnackbar('Curso atualizado com sucesso');
      } else {
        await cursosService.criar(formData);
        mostrarSnackbar('Curso criado com sucesso');
      }
      fecharDialog();
      carregarCursos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar curso';
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove um curso
   * @param {string} id - ID do curso a ser removido
   */
  const removerCurso = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este curso?')) {
      try {
        await cursosService.remover(id);
        mostrarSnackbar('Curso removido com sucesso');
        carregarCursos();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover curso';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  /**
   * Manipula a ordenação da tabela
   * @param {string} property - Propriedade para ordenação
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * Manipula mudança nos turnos selecionados
   * @param {string} turno - Turno a ser adicionado/removido
   */
  const handleTurnoChange = (turno) => {
    const newTurnos = formData.turnos.includes(turno)
      ? formData.turnos.filter(t => t !== turno)
      : [...formData.turnos, turno];
    setFormData({ ...formData, turnos: newTurnos });
  };

  /**
   * Obtém o nome da instituição pelo ID ou objeto
   * @param {string|Object} instituicaoData - ID da instituição ou objeto da instituição
   * @returns {string} Nome da instituição
   */
  const getNomeInstituicao = (instituicaoData) => {
    if (typeof instituicaoData === 'object' && instituicaoData?.nome) {
      return instituicaoData.nome;
    }
    const instituicao = instituicoes.find(inst => inst._id === instituicaoData);
    return instituicao ? instituicao.nome : 'N/A';
  };

  /**
   * Filtra e ordena os cursos
   */
  const cursosProcessados = cursos
    .filter((curso) =>
      curso.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      getNomeInstituicao(curso.instituicaoId).toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      if (orderBy === 'instituicaoId') {
        aValue = getNomeInstituicao(a.instituicaoId);
        bValue = getNomeInstituicao(b.instituicaoId);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  useEffect(() => {
    carregarCursos();
    carregarInstituicoes();
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
            Novo Curso
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar cursos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
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
              <TableCell>Turnos</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ativo'}
                  direction={orderBy === 'ativo' ? order : 'asc'}
                  onClick={() => handleRequestSort('ativo')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'instituicaoId'}
                  direction={orderBy === 'instituicaoId' ? order : 'asc'}
                  onClick={() => handleRequestSort('instituicaoId')}
                >
                  Instituição
                </TableSortLabel>
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursosProcessados.map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.nome}</TableCell>
                <TableCell>{curso.turnos?.join(', ') || 'N/A'}</TableCell>
                <TableCell>
                  <Typography color={curso.ativo ? 'success.main' : 'error.main'}>
                    {curso.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>{getNomeInstituicao(curso.instituicaoId)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(curso)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerCurso(curso._id)}
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
          {editingId ? 'Editar Curso' : 'Novo Curso'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome *"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Instituição *</InputLabel>
              <Select
                value={formData.instituicaoId}
                onChange={(e) => setFormData({ ...formData, instituicaoId: e.target.value })}
                label="Instituição *"
              >
                {instituicoes.map((instituicao) => (
                  <MenuItem key={instituicao._id} value={instituicao._id}>
                    {instituicao.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Turnos</FormLabel>
              <FormGroup row>
                {turnosDisponiveis.map((turno) => (
                  <FormControlLabel
                    key={turno}
                    control={
                      <Checkbox
                        checked={formData.turnos.includes(turno)}
                        onChange={() => handleTurnoChange(turno)}
                      />
                    }
                    label={turno}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarCurso} variant="contained">
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

export default Cursos;