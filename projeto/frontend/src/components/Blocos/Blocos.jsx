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
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import blocoService from "../../services/blocoService";

/**
 * Componente para gerenciamento de blocos de horários
 * @component
 * @returns {JSX.Element} Componente de blocos de horários
 */
const Blocos = () => {
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBloco, setEditingBloco] = useState(null);
  const [formData, setFormData] = useState({
    turno: "",
    diaSemana: "",
    inicio: "",
    fim: "",
    ordem: "",
  });
  const [filtroTurno, setFiltroTurno] = useState("");
  const [filtroDiaSemana, setFiltroDiaSemana] = useState("");
  const [orderBy, setOrderBy] = useState("turno");
  const [order, setOrder] = useState("asc");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const turnos = ["Manhã", "Tarde", "Noite", "Integral"];
  const diasSemana = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  /**
   * Carrega lista de blocos
   * @async
   * @function carregarBlocos
   */
  const carregarBlocos = async () => {
    try {
      setLoading(true);
      const response = await blocoService.listar();
      setBlocos(response.data?.blocos || response.data || []);
    } catch (error) {
      mostrarSnackbar("Erro ao carregar blocos de horários", "error");
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
   * Abre dialog para criar/editar bloco
   * @function abrirDialog
   * @param {Object|null} bloco - Bloco para edição ou null para criação
   */
  const abrirDialog = (bloco = null) => {
    if (bloco) {
      setEditingBloco(bloco);
      setFormData({
        turno: bloco.turno,
        diaSemana: bloco.diaSemana,
        inicio: bloco.inicio,
        fim: bloco.fim,
        ordem: bloco.ordem.toString(),
      });
    } else {
      setEditingBloco(null);
      setFormData({
        turno: "",
        diaSemana: "",
        inicio: "",
        fim: "",
        ordem: "",
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
    setEditingBloco(null);
    setFormData({
      turno: "",
      diaSemana: "",
      inicio: "",
      fim: "",
      ordem: "",
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
   * Valida horário no formato HH:mm
   * @function validarHorario
   * @param {string} horario - Horário a ser validado
   * @returns {boolean} True se válido
   */
  const validarHorario = (horario) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(horario);
  };

  /**
   * Converte horário HH:mm para minutos
   * @function horarioParaMinutos
   * @param {string} horario - Horário no formato HH:mm
   * @returns {number} Minutos desde 00:00
   */
  const horarioParaMinutos = (horario) => {
    const [horas, minutos] = horario.split(":").map(Number);
    return horas * 60 + minutos;
  };

  /**
   * Valida formulário
   * @function validarFormulario
   * @returns {boolean} True se válido
   */
  const validarFormulario = () => {
    if (!formData.turno) {
      mostrarSnackbar("Turno é obrigatório", "error");
      return false;
    }

    if (!formData.diaSemana) {
      mostrarSnackbar("Dia da semana é obrigatório", "error");
      return false;
    }

    if (!formData.inicio || !validarHorario(formData.inicio)) {
      mostrarSnackbar("Horário de início deve estar no formato HH:mm", "error");
      return false;
    }

    if (!formData.fim || !validarHorario(formData.fim)) {
      mostrarSnackbar("Horário de fim deve estar no formato HH:mm", "error");
      return false;
    }

    const inicioMinutos = horarioParaMinutos(formData.inicio);
    const fimMinutos = horarioParaMinutos(formData.fim);

    if (inicioMinutos >= fimMinutos) {
      mostrarSnackbar(
        "Horário de início deve ser anterior ao horário de fim",
        "error"
      );
      return false;
    }

    const ordem = parseInt(formData.ordem);
    if (!ordem || ordem < 1) {
      mostrarSnackbar("Ordem deve ser um número positivo", "error");
      return false;
    }

    return true;
  };

  /**
   * Salva bloco (criar ou atualizar)
   * @async
   * @function salvarBloco
   */
  const salvarBloco = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const dadosBloco = {
        turno: formData.turno,
        diaSemana: formData.diaSemana,
        inicio: formData.inicio,
        fim: formData.fim,
        ordem: parseInt(formData.ordem),
      };

      if (editingBloco) {
        await blocoService.update(editingBloco._id, dadosBloco);
        mostrarSnackbar("Bloco atualizado com sucesso");
      } else {
        await blocoService.create(dadosBloco);
        mostrarSnackbar("Bloco criado com sucesso");
      }

      fecharDialog();
      carregarBlocos();
    } catch (error) {
      let message = "Erro ao salvar bloco";

      if (error.response?.status === 409) {
        message = "Um bloco já existe para este Turno, Dia e Ordem";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      mostrarSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove bloco
   * @async
   * @function removerBloco
   * @param {string} id - ID do bloco
   */
  const removerBloco = async (id) => {
    if (
      !window.confirm("Tem certeza que deseja remover este bloco de horário?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await blocoService.delete(id);
      mostrarSnackbar("Bloco removido com sucesso");
      carregarBlocos();
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao remover bloco";
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
   * Filtra e ordena blocos
   * @function getBlocosFiltrados
   * @returns {Array} Lista filtrada e ordenada
   */
  const getBlocosFiltrados = () => {
    let filtered = blocos.filter((bloco) => {
      const matchTurno = !filtroTurno || bloco.turno === filtroTurno;
      const matchDiaSemana =
        !filtroDiaSemana ||
        bloco.diaSemana.toLowerCase().includes(filtroDiaSemana.toLowerCase());
      return matchTurno && matchDiaSemana;
    });

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
    carregarBlocos();
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
        <Typography variant="h5">Blocos de Horários</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirDialog()}
          disabled={loading}
        >
          Novo Bloco
        </Button>
      </Box>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filtrar por Turno</InputLabel>
            <Select
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value)}
              label="Filtrar por Turno"
            >
              <MenuItem value="">Todos</MenuItem>
              {turnos.map((turno) => (
                <MenuItem key={turno} value={turno}>
                  {turno}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Filtrar por dia da semana..."
            value={filtroDiaSemana}
            onChange={(e) => setFiltroDiaSemana(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "turno"}
                  direction={orderBy === "turno" ? order : "asc"}
                  onClick={() => handleSort("turno")}
                >
                  Turno
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "diaSemana"}
                  direction={orderBy === "diaSemana" ? order : "asc"}
                  onClick={() => handleSort("diaSemana")}
                >
                  Dia da Semana
                </TableSortLabel>
              </TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Fim</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "ordem"}
                  direction={orderBy === "ordem" ? order : "asc"}
                  onClick={() => handleSort("ordem")}
                >
                  Ordem
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBlocosFiltrados().map((bloco) => (
              <TableRow key={bloco._id}>
                <TableCell>{bloco.turno}</TableCell>
                <TableCell>{bloco.diaSemana}</TableCell>
                <TableCell>{bloco.inicio}</TableCell>
                <TableCell>{bloco.fim}</TableCell>
                <TableCell>{bloco.ordem}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => abrirDialog(bloco)}
                    disabled={loading}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => removerBloco(bloco._id)}
                    disabled={loading}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {getBlocosFiltrados().length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {loading ? "Carregando..." : "Nenhum bloco encontrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Criação/Edição */}
      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBloco ? "Editar Bloco" : "Novo Bloco"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Turno</InputLabel>
              <Select
                name="turno"
                value={formData.turno}
                onChange={handleInputChange}
                label="Turno"
              >
                {turnos.map((turno) => (
                  <MenuItem key={turno} value={turno}>
                    {turno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Dia da Semana</InputLabel>
              <Select
                name="diaSemana"
                value={formData.diaSemana}
                onChange={handleInputChange}
                label="Dia da Semana"
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="inicio"
              label="Início *"
              value={formData.inicio}
              onChange={handleInputChange}
              fullWidth
              required
              placeholder="HH:mm"
              inputProps={{ pattern: "[0-2][0-9]:[0-5][0-9]" }}
            />

            <TextField
              name="fim"
              label="Fim *"
              value={formData.fim}
              onChange={handleInputChange}
              fullWidth
              required
              placeholder="HH:mm"
              inputProps={{ pattern: "[0-2][0-9]:[0-5][0-9]" }}
            />

            <TextField
              name="ordem"
              label="Ordem *"
              type="number"
              value={formData.ordem}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarBloco} variant="contained" disabled={loading}>
            {editingBloco ? "Atualizar" : "Criar"}
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

export default Blocos;
