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
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { disciplinasService, cursosService, professoresService } from '../../services/api';

/**
 * Componente para gerenciamento de disciplinas
 * @component
 * @returns {JSX.Element} Componente de disciplinas
 */
const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
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
    cursoId: '',
    professorId: '',
    cargaHoraria: '',
    status: 'Ativo',
  });

  /**
   * Carrega a lista de disciplinas
   */
  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.listar();
      const data = response.data?.disciplinas || [];
      setDisciplinas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      mostrarSnackbar('Erro ao carregar disciplinas', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega a lista de cursos para o select
   */
  const carregarCursos = async () => {
    try {
      const response = await cursosService.listar();
      const data = response.data?.cursos || response.data || [];
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  /**
   * Carrega a lista de professores para o select
   */
  const carregarProfessores = async () => {
    try {
      const response = await professoresService.listar();
      const data = response.data?.professores || [];
      setProfessores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
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
   * Valida os dados do formulário
   * @returns {boolean} True se todos os dados são válidos
   */
  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cursoId) {
      newErrors.cursoId = 'Curso é obrigatório';
    }

    if (!formData.cargaHoraria || formData.cargaHoraria <= 0) {
      newErrors.cargaHoraria = 'Carga horária deve ser um número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Abre o dialog para criar/editar disciplina
   * @param {Object|null} disciplina - Disciplina a ser editada ou null para nova
   */
  const abrirDialog = (disciplina = null) => {
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        cursoId: disciplina.cursoId?._id || disciplina.cursoId || '',
        professorId: disciplina.professorId?._id || disciplina.professorId || '',
        cargaHoraria: disciplina.cargaHoraria || '',
        status: disciplina.status || 'Ativo',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        cursoId: '',
        professorId: '',
        cargaHoraria: '',
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
   * Salva a disciplina (criar ou atualizar)
   */
  const salvarDisciplina = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      const dadosEnvio = {
        ...formData,
        cargaHoraria: parseInt(formData.cargaHoraria),
        professorId: formData.professorId || null
      };

      if (editingId) {
        await disciplinasService.atualizar(editingId, dadosEnvio);
        mostrarSnackbar('Disciplina atualizada com sucesso');
      } else {
        await disciplinasService.criar(dadosEnvio);
        mostrarSnackbar('Disciplina criada com sucesso');
      }
      fecharDialog();
      carregarDisciplinas();
    } catch (error) {
      let message = 'Erro ao salvar disciplina';
      
      if (error.response?.status === 404) {
        if (error.response.data?.message?.includes('Curso')) {
          message = 'Curso selecionado não foi encontrado';
        } else if (error.response.data?.message?.includes('Professor')) {
          message = 'Professor selecionado não foi encontrado';
        } else {
          message = 'Registro relacionado não encontrado';
        }
      } else {
        message = error.response?.data?.message || message;
      }
      
      mostrarSnackbar(message, 'error');
    }
  };

  /**
   * Remove uma disciplina
   * @param {string} id - ID da disciplina
   */
  const removerDisciplina = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta disciplina?')) {
      try {
        await disciplinasService.remover(id);
        mostrarSnackbar('Disciplina removida com sucesso');
        carregarDisciplinas();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover disciplina';
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
    let aValue = a[orderBy];
    let bValue = b[orderBy];
    
    // Para campos aninhados como cursoId.nome
    if (orderBy === 'curso' && a.cursoId) {
      aValue = a.cursoId.nome || '';
      bValue = b.cursoId?.nome || '';
    }
    
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
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
   * Filtra e ordena as disciplinas
   */
  const disciplinasFiltradas = Array.isArray(disciplinas) ? disciplinas
    .filter((disciplina) =>
      disciplina.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      disciplina.cursoId?.nome?.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort(getComparator(order, orderBy)) : [];

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
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
            Nova Disciplina
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar por nome da disciplina ou curso..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 350 }}
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
                  Nome da Disciplina
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'cargaHoraria'}
                  direction={orderBy === 'cargaHoraria' ? order : 'asc'}
                  onClick={() => handleRequestSort('cargaHoraria')}
                >
                  Carga Horária
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'curso'}
                  direction={orderBy === 'curso' ? order : 'asc'}
                  onClick={() => handleRequestSort('curso')}
                >
                  Curso
                </TableSortLabel>
              </TableCell>
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
            {disciplinasFiltradas.map((disciplina) => (
              <TableRow key={disciplina._id}>
                <TableCell>{disciplina.nome}</TableCell>
                <TableCell>{disciplina.cargaHoraria}h</TableCell>
                <TableCell>{disciplina.cursoId?.nome || 'N/A'}</TableCell>
                <TableCell>
                  <Typography color={disciplina.status === 'Ativo' ? 'success.main' : 'error.main'}>
                    {disciplina.status || 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(disciplina)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerDisciplina(disciplina._id)}
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
          {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
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
            
            <FormControl fullWidth required error={!!errors.cursoId}>
              <InputLabel>Curso *</InputLabel>
              <Select
                value={formData.cursoId}
                onChange={(e) => setFormData({ ...formData, cursoId: e.target.value })}
                label="Curso *"
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.cursoId && <FormHelperText>{errors.cursoId}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Professor</InputLabel>
              <Select
                value={formData.professorId}
                onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                label="Professor"
              >
                <MenuItem value="">
                  <em>Nenhum professor selecionado</em>
                </MenuItem>
                {professores.map((professor) => (
                  <MenuItem key={professor._id} value={professor._id}>
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Carga Horária *"
              type="number"
              value={formData.cargaHoraria}
              onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 1 }}
              error={!!errors.cargaHoraria}
              helperText={errors.cargaHoraria}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarDisciplina} variant="contained">
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

export default Disciplinas;