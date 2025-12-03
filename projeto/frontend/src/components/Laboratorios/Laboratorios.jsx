import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  TableSortLabel,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import laboratorioService from "../../services/laboratorioService";

/**
 * Componente para gerenciamento de laboratórios
 * @component
 * @returns {JSX.Element} Componente de laboratórios
 */
const Laboratorios = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLaboratorio, setEditingLaboratorio] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    capacidade: "",
    local: "",
    status: "Ativo",
  });
  const [filtro, setFiltro] = useState("");
  const [orderBy, setOrderBy] = useState("nome");
  const [order, setOrder] = useState("asc");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /**
   * Carrega lista de laboratórios
   * @async
   * @function carregarLaboratorios
   */
  const carregarLaboratorios = async () => {
    try {
      setLoading(true);
      const response = await laboratorioService.listar();
      setLaboratorios(response.data?.laboratorios || response.data || []);
    } catch (error) {
      mostrarSnackbar("Erro ao carregar laboratórios", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mostra mensagem no snackbar
   * @function mostrarSnackbar
   * @param {string} message - Mensagem a ser exibida
   * @param {string} severity - Tipo da mensagem (success, error, warning, info)
   */
  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Fecha o snackbar
   * @function fecharSnackbar
   */
  const fecharSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Abre dialog para criar/editar laboratório
   * @function abrirDialog
   * @param {Object|null} laboratorio - Laboratório para edição ou null para criação
   */
  const abrirDialog = (laboratorio = null) => {
    if (laboratorio) {
      setEditingLaboratorio(laboratorio);
      setFormData({
        nome: laboratorio.nome,
        capacidade: laboratorio.capacidade.toString(),
        local: laboratorio.local || "",
        status: laboratorio.status,
      });
    } else {
      setEditingLaboratorio(null);
      setFormData({
        nome: "",
        capacidade: "",
        local: "",
        status: "Ativo",
      });
    }
    setDialogOpen(true);
  };

  /**
   * Fecha dialog
   * @function fecharDialog
   */
  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingLaboratorio(null);
    setFormData({
      nome: "",
      capacidade: "",
      local: "",
      status: "Ativo",
    });
  };

  /**
   * Manipula mudanças nos campos do formulário
   * @function handleInputChange
   * @param {Object} event - Evento de mudança
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Valida formulário
   * @function validarFormulario
   * @returns {boolean} True se válido
   */
  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      mostrarSnackbar("Nome é obrigatório", "error");
      return false;
    }

    const capacidade = parseInt(formData.capacidade);
    if (!capacidade || capacidade <= 0) {
      mostrarSnackbar("Capacidade deve ser um número maior que 0", "error");
      return false;
    }

    return true;
  };

  /**
   * Salva laboratório (criar ou atualizar)
   * @async
   * @function salvarLaboratorio
   */
  const salvarLaboratorio = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const dadosLaboratorio = {
        nome: formData.nome.trim(),
        capacidade: parseInt(formData.capacidade),
        local: formData.local.trim() || undefined,
        status: formData.status,
      };

      if (editingLaboratorio) {
        await laboratorioService.update(
          editingLaboratorio._id,
          dadosLaboratorio
        );
        mostrarSnackbar("Laboratório atualizado com sucesso");
      } else {
        await laboratorioService.create(dadosLaboratorio);
        mostrarSnackbar("Laboratório criado com sucesso");
      }

      fecharDialog();
      carregarLaboratorios();
    } catch (error) {
      const message =
        error.response?.data?.message || "Erro ao salvar laboratório";
      mostrarSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove laboratório
   * @async
   * @function removerLaboratorio
   * @param {string} id - ID do laboratório
   */
  const removerLaboratorio = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este laboratório?")) {
      return;
    }

    try {
      setLoading(true);
      await laboratorioService.delete(id);
      mostrarSnackbar("Laboratório removido com sucesso");
      carregarLaboratorios();
    } catch (error) {
      const message =
        error.response?.data?.message || "Erro ao remover laboratório";
      mostrarSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipula ordenação da tabela
   * @function handleSort
   * @param {string} property - Propriedade para ordenar
   */
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * Filtra e ordena laboratórios
   * @function getLaboratoriosFiltrados
   * @returns {Array} Lista filtrada e ordenada
   */
  const getLaboratoriosFiltrados = () => {
    let filtered = laboratorios.filter(
      (lab) =>
        lab.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        (lab.local && lab.local.toLowerCase().includes(filtro.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  useEffect(() => {
    carregarLaboratorios();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {/* Cabeçalho */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Laboratórios</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirDialog()}
          disabled={loading}
        >
          Novo Laboratório
        </Button>
      </Box>

      {/* Filtro */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome ou local..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />
      </Box>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nome"}
                  direction={orderBy === "nome" ? order : "asc"}
                  onClick={() => handleSort("nome")}
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "capacidade"}
                  direction={orderBy === "capacidade" ? order : "asc"}
                  onClick={() => handleSort("capacidade")}
                >
                  Capacidade
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "local"}
                  direction={orderBy === "local" ? order : "asc"}
                  onClick={() => handleSort("local")}
                >
                  Local
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getLaboratoriosFiltrados().map((laboratorio) => (
              <TableRow key={laboratorio._id}>
                <TableCell>{laboratorio.nome}</TableCell>
                <TableCell>{laboratorio.capacidade}</TableCell>
                <TableCell>{laboratorio.local || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={laboratorio.status}
                    color={
                      laboratorio.status === "Ativo" ? "success" : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => abrirDialog(laboratorio)}
                    disabled={loading}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => removerLaboratorio(laboratorio._id)}
                    disabled={loading}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {getLaboratoriosFiltrados().length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? "Carregando..." : "Nenhum laboratório encontrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Criação/Edição */}
      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingLaboratorio ? "Editar Laboratório" : "Novo Laboratório"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              name="nome"
              label="Nome *"
              value={formData.nome}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="capacidade"
              label="Capacidade *"
              type="number"
              value={formData.capacidade}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              name="local"
              label="Local"
              value={formData.local}
              onChange={handleInputChange}
              fullWidth
              placeholder="Ex: Bloco A - Sala 101"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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
          <Button
            onClick={salvarLaboratorio}
            variant="contained"
            disabled={loading}
          >
            {editingLaboratorio ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={fecharSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={fecharSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Laboratorios;
