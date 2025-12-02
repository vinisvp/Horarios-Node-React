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
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  aulasService,
  cursosService,
  disciplinasService,
  professoresService,
} from "../../services/api";
import laboratorioService from "../../services/laboratorioService";
import blocoService from "../../services/blocoService";

/**
 * Componente para gerenciamento de aulas
 * @component
 * @returns {JSX.Element} Componente de aulas
 */
const Aulas = () => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filtroLaboratorio, setFiltroLaboratorio] = useState("");
  const [filtroProfessor, setFiltroProfessor] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [aulaAtual, setAulaAtual] = useState({
    semestre: "",
    cursoId: "",
    disciplinaId: "",
    professorId: "",
    laboratorioId: "",
    diaSemana: "",
    blocos: [],
    dataInicio: "",
    dataFim: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [erros, setErros] = useState({});

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
   * Carrega dados iniciais
   */
  useEffect(() => {
    carregarDados();
  }, []);

  /**
   * Carrega todas as aulas e dados relacionados
   */
  const carregarDados = async () => {
    try {
      const [
        aulasRes,
        cursosRes,
        disciplinasRes,
        professoresRes,
        laboratoriosRes,
        blocosRes,
      ] = await Promise.all([
        aulasService.listar(),
        cursosService.listar(),
        disciplinasService.listar(),
        professoresService.listar(),
        laboratorioService.listar(),
        blocoService.listar(),
      ]);

      // Normalizar aulas: garantir que IDs sejam strings, não objetos
      const aulasNormalizadas = (
        aulasRes.data?.aulas ||
        aulasRes.data ||
        []
      ).map((aula) => ({
        ...aula,
        cursoId:
          typeof aula.cursoId === "object" ? aula.cursoId._id : aula.cursoId,
        disciplinaId:
          typeof aula.disciplinaId === "object"
            ? aula.disciplinaId._id
            : aula.disciplinaId,
        professorId:
          typeof aula.professorId === "object"
            ? aula.professorId._id
            : aula.professorId,
        laboratorioId:
          typeof aula.laboratorioId === "object"
            ? aula.laboratorioId._id
            : aula.laboratorioId,
        blocos: (aula.blocos || []).map((bloco) =>
          typeof bloco === "object" ? bloco._id : bloco
        ),
      }));

      setAulas(aulasNormalizadas);
      setCursos(cursosRes.data?.cursos || cursosRes.data || []);
      setDisciplinas(
        disciplinasRes.data?.disciplinas || disciplinasRes.data || []
      );
      setProfessores(
        professoresRes.data?.professores || professoresRes.data || []
      );
      // laboratorioService retorna { laboratorios, pagination } ou array direto
      setLaboratorios(
        laboratoriosRes.data?.laboratorios || laboratoriosRes.data || []
      );
      // blocoService retorna { blocos, pagination } ou array direto
      setBlocos(blocosRes.data?.blocos || blocosRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      mostrarSnackbar("Erro ao carregar dados", "error");
    }
  };

  /**
   * Filtra aulas baseado nos critérios
   */
  const aulasFiltradas = aulas.filter((aula) => {
    const disciplina = disciplinas.find((d) => d._id === aula.disciplinaId);

    const matchFiltro =
      !filtro ||
      disciplina?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      aula.semestre.toLowerCase().includes(filtro.toLowerCase());

    const matchLaboratorio =
      !filtroLaboratorio || aula.laboratorioId === filtroLaboratorio;
    const matchProfessor =
      !filtroProfessor || aula.professorId === filtroProfessor;

    return matchFiltro && matchLaboratorio && matchProfessor;
  });

  /**
   * Abre dialog para nova aula
   */
  const handleNovo = () => {
    setAulaAtual({
      semestre: "",
      cursoId: "",
      disciplinaId: "",
      professorId: "",
      laboratorioId: "",
      diaSemana: "",
      blocos: [],
      dataInicio: "",
      dataFim: "",
    });
    setEditando(false);
    setErros({});
    setDialogOpen(true);
  };

  /**
   * Abre dialog para editar aula
   * @param {Object} aula - Aula a ser editada
   */
  const handleEditar = (aula) => {
    // Garantir que blocos sejam apenas IDs, não objetos
    const blocosIds = Array.isArray(aula.blocos)
      ? aula.blocos.map((bloco) =>
          typeof bloco === "object" ? bloco._id : bloco
        )
      : [];

    setAulaAtual({
      ...aula,
      blocos: blocosIds,
      dataInicio: aula.dataInicio?.split("T")[0] || "",
      dataFim: aula.dataFim?.split("T")[0] || "",
    });
    setEditando(true);
    setErros({});
    setDialogOpen(true);
  };

  /**
   * Remove uma aula
   * @param {string} id - ID da aula
   */
  const handleRemover = async (id) => {
    if (window.confirm("Tem certeza que deseja remover esta aula?")) {
      try {
        await aulasService.remover(id);
        carregarDados();
        mostrarSnackbar("Aula removida com sucesso!");
      } catch (error) {
        mostrarSnackbar("Erro ao remover aula", "error");
      }
    }
  };

  /**
   * Valida formulário
   */
  const validarFormulario = () => {
    const novosErros = {};

    if (!aulaAtual.semestre) novosErros.semestre = "Semestre é obrigatório";
    if (!aulaAtual.cursoId) novosErros.cursoId = "Curso é obrigatório";
    if (!aulaAtual.disciplinaId)
      novosErros.disciplinaId = "Disciplina é obrigatória";
    if (!aulaAtual.professorId)
      novosErros.professorId = "Professor é obrigatório";
    if (!aulaAtual.laboratorioId)
      novosErros.laboratorioId = "Laboratório é obrigatório";
    if (!aulaAtual.diaSemana)
      novosErros.diaSemana = "Dia da semana é obrigatório";
    if (!aulaAtual.blocos.length)
      novosErros.blocos = "Pelo menos um bloco deve ser selecionado";
    if (!aulaAtual.dataInicio)
      novosErros.dataInicio = "Data de início é obrigatória";
    if (!aulaAtual.dataFim) novosErros.dataFim = "Data de fim é obrigatória";

    if (
      aulaAtual.dataInicio &&
      aulaAtual.dataFim &&
      aulaAtual.dataInicio > aulaAtual.dataFim
    ) {
      novosErros.dataFim = "Data de fim deve ser posterior à data de início";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  /**
   * Salva aula (criar ou atualizar)
   */
  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    try {
      if (editando) {
        await aulasService.atualizar(aulaAtual._id, aulaAtual);
        mostrarSnackbar("Aula atualizada com sucesso!");
      } else {
        await aulasService.criar(aulaAtual);
        mostrarSnackbar("Aula criada com sucesso!");
      }
      setDialogOpen(false);
      carregarDados();
    } catch (error) {
      if (error.response?.status === 409) {
        const message =
          error.response.data.message || "Conflito de horário detectado";
        mostrarSnackbar(message, "error");
      } else {
        mostrarSnackbar("Erro ao salvar aula", "error");
      }
    }
  };

  /**
   * Mostra snackbar com mensagem
   * @param {string} message - Mensagem
   * @param {string} severity - Severidade
   */
  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Obtém nome da entidade por ID
   */
  const obterNome = (lista, id, campo = "nome") => {
    if (!id) return "N/A";
    const item = lista.find((item) => item._id === id);
    return item ? item[campo] || "N/A" : "N/A";
  };

  /**
   * Obtém nomes dos blocos selecionados
   */
  const obterNomesBlocos = (blocosIds) => {
    if (!Array.isArray(blocosIds) || blocosIds.length === 0) return "N/A";

    return blocosIds
      .map((item) => {
        // Se é um objeto, extrai o ID; se é string, usa como está
        const id = typeof item === "object" ? item._id : item;
        const bloco = blocos.find((b) => b._id === id);
        return bloco ? `${bloco.turno} (${bloco.inicio}-${bloco.fim})` : "N/A";
      })
      .join(", ");
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Filtrar por disciplina ou semestre"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Professor</InputLabel>
          <Select
            value={filtroProfessor}
            onChange={(e) => setFiltroProfessor(e.target.value)}
            label="Professor"
          >
            <MenuItem value="">Todos</MenuItem>
            {professores.map((professor) => (
              <MenuItem key={professor._id} value={professor._id}>
                {professor.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Laboratório</InputLabel>
          <Select
            value={filtroLaboratorio}
            onChange={(e) => setFiltroLaboratorio(e.target.value)}
            label="Laboratório"
          >
            <MenuItem value="">Todos</MenuItem>
            {laboratorios.map((laboratorio) => (
              <MenuItem key={laboratorio._id} value={laboratorio._id}>
                {laboratorio.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovo}
        >
          Nova Aula
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Semestre</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Laboratório</TableCell>
              <TableCell>Dia da Semana</TableCell>
              <TableCell>Blocos</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aulasFiltradas.map((aula) => (
              <TableRow key={aula._id}>
                <TableCell>{aula.semestre}</TableCell>
                <TableCell>{obterNome(cursos, aula.cursoId)}</TableCell>
                <TableCell>
                  {obterNome(disciplinas, aula.disciplinaId)}
                </TableCell>
                <TableCell>
                  {obterNome(professores, aula.professorId)}
                </TableCell>
                <TableCell>
                  {obterNome(laboratorios, aula.laboratorioId)}
                </TableCell>
                <TableCell>{aula.diaSemana}</TableCell>
                <TableCell>{obterNomesBlocos(aula.blocos)}</TableCell>
                <TableCell>
                  {new Date(aula.dataInicio).toLocaleDateString()} -{" "}
                  {new Date(aula.dataFim).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditar(aula)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemover(aula._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editando ? "Editar Aula" : "Nova Aula"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Semestre"
              value={aulaAtual.semestre}
              onChange={(e) =>
                setAulaAtual({ ...aulaAtual, semestre: e.target.value })
              }
              error={!!erros.semestre}
              helperText={erros.semestre}
              placeholder="Ex: 2024.2"
              fullWidth
            />

            <FormControl error={!!erros.cursoId} fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select
                value={aulaAtual.cursoId}
                onChange={(e) =>
                  setAulaAtual({ ...aulaAtual, cursoId: e.target.value })
                }
                label="Curso"
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
              {erros.cursoId && (
                <FormHelperText>{erros.cursoId}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!erros.disciplinaId} fullWidth>
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={aulaAtual.disciplinaId}
                onChange={(e) =>
                  setAulaAtual({ ...aulaAtual, disciplinaId: e.target.value })
                }
                label="Disciplina"
              >
                {disciplinas.map((disciplina) => (
                  <MenuItem key={disciplina._id} value={disciplina._id}>
                    {disciplina.nome}
                  </MenuItem>
                ))}
              </Select>
              {erros.disciplinaId && (
                <FormHelperText>{erros.disciplinaId}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!erros.professorId} fullWidth>
              <InputLabel>Professor</InputLabel>
              <Select
                value={aulaAtual.professorId}
                onChange={(e) =>
                  setAulaAtual({ ...aulaAtual, professorId: e.target.value })
                }
                label="Professor"
              >
                {professores.map((professor) => (
                  <MenuItem key={professor._id} value={professor._id}>
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
              {erros.professorId && (
                <FormHelperText>{erros.professorId}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!erros.laboratorioId} fullWidth>
              <InputLabel>Laboratório</InputLabel>
              <Select
                value={aulaAtual.laboratorioId}
                onChange={(e) =>
                  setAulaAtual({ ...aulaAtual, laboratorioId: e.target.value })
                }
                label="Laboratório"
              >
                {laboratorios.map((laboratorio) => (
                  <MenuItem key={laboratorio._id} value={laboratorio._id}>
                    {laboratorio.nome}
                  </MenuItem>
                ))}
              </Select>
              {erros.laboratorioId && (
                <FormHelperText>{erros.laboratorioId}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!erros.diaSemana} fullWidth>
              <InputLabel>Dia da Semana</InputLabel>
              <Select
                value={aulaAtual.diaSemana}
                onChange={(e) =>
                  setAulaAtual({ ...aulaAtual, diaSemana: e.target.value })
                }
                label="Dia da Semana"
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
              {erros.diaSemana && (
                <FormHelperText>{erros.diaSemana}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!erros.blocos} fullWidth>
              <InputLabel>Blocos</InputLabel>
              <Select
                multiple
                value={aulaAtual.blocos}
                onChange={(e) =>
                  setAulaAtual({ ...aulaAtual, blocos: e.target.value })
                }
                input={<OutlinedInput label="Blocos" />}
                renderValue={(selected) => {
                  // Garantir que selected seja um array de IDs
                  const selectedIds = Array.isArray(selected)
                    ? selected.map((item) =>
                        typeof item === "object" ? item._id : item
                      )
                    : [];

                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selectedIds.map((id) => {
                        const bloco = blocos.find((b) => b._id === id);
                        return (
                          <Chip
                            key={id}
                            label={
                              bloco
                                ? `${bloco.turno} (${bloco.inicio}-${bloco.fim})`
                                : id
                            }
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  );
                }}
              >
                {blocos.map((bloco) => (
                  <MenuItem key={bloco._id} value={bloco._id}>
                    {bloco.turno} - {bloco.diaSemana} ({bloco.inicio}-
                    {bloco.fim})
                  </MenuItem>
                ))}
              </Select>
              {erros.blocos && <FormHelperText>{erros.blocos}</FormHelperText>}
            </FormControl>

            <TextField
              label="Data de Início"
              type="date"
              value={aulaAtual.dataInicio}
              onChange={(e) =>
                setAulaAtual({ ...aulaAtual, dataInicio: e.target.value })
              }
              error={!!erros.dataInicio}
              helperText={erros.dataInicio}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Data de Fim"
              type="date"
              value={aulaAtual.dataFim}
              onChange={(e) =>
                setAulaAtual({ ...aulaAtual, dataFim: e.target.value })
              }
              error={!!erros.dataFim}
              helperText={erros.dataFim}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSalvar} variant="contained">
            {editando ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Aulas;
