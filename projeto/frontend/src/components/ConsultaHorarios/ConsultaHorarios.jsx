import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from "@mui/material";
import {
  aulasService,
  cursosService,
  disciplinasService,
  professoresService,
} from "../../services/api";
import laboratorioService from "../../services/laboratorioService";

const ConsultaHorarios = () => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [filtros, setFiltros] = useState({
    laboratorioId: "",
    cursoId: "",
    disciplinaId: "",
    professorId: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    carregarAulas();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [cursosRes, disciplinasRes, professoresRes, laboratoriosRes] =
        await Promise.all([
          cursosService.listar(),
          disciplinasService.listar(),
          professoresService.listar(),
          laboratorioService.listar(),
        ]);

      setCursos(cursosRes.data?.cursos || cursosRes.data || []);
      setDisciplinas(
        disciplinasRes.data?.disciplinas || disciplinasRes.data || []
      );
      setProfessores(
        professoresRes.data?.professores || professoresRes.data || []
      );
      setLaboratorios(
        laboratoriosRes.data?.laboratorios || laboratoriosRes.data || []
      );

      await carregarAulas();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setErro("Erro ao carregar dados. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const carregarAulas = async () => {
    try {
      const params = {};
      if (filtros.laboratorioId) params.laboratorioId = filtros.laboratorioId;
      if (filtros.cursoId) params.cursoId = filtros.cursoId;
      if (filtros.disciplinaId) params.disciplinaId = filtros.disciplinaId;
      if (filtros.professorId) params.professorId = filtros.professorId;

      const response = await aulasService.listar(params);
      const aulasData = response.data?.aulas || response.data || [];
      setAulas(aulasData);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
      setErro("Erro ao carregar horários.");
    }
  };

  const obterNome = (lista, id, campo = "nome") => {
    if (!id) return "N/A";
    const item = lista.find((item) => {
      const itemId = typeof item === "object" ? item._id : item;
      const searchId = typeof id === "object" ? id._id : id;
      return itemId === searchId;
    });
    return item ? item[campo] || "N/A" : "N/A";
  };

  const obterBlocosFormatados = (blocos) => {
    if (!Array.isArray(blocos) || blocos.length === 0) return "N/A";
    return blocos
      .map((bloco) => {
        if (typeof bloco === "object" && bloco.inicio && bloco.fim) {
          return `${bloco.inicio}-${bloco.fim}`;
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const limparFiltros = () => {
    setFiltros({
      laboratorioId: "",
      cursoId: "",
      disciplinaId: "",
      professorId: "",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Consulta de Horários
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Laboratório</InputLabel>
              <Select
                value={filtros.laboratorioId}
                onChange={(e) =>
                  setFiltros({ ...filtros, laboratorioId: e.target.value })
                }
                label="Laboratório"
              >
                <MenuItem value="">Todos</MenuItem>
                {laboratorios.map((lab) => (
                  <MenuItem key={lab._id} value={lab._id}>
                    {lab.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Curso</InputLabel>
              <Select
                value={filtros.cursoId}
                onChange={(e) =>
                  setFiltros({ ...filtros, cursoId: e.target.value })
                }
                label="Curso"
              >
                <MenuItem value="">Todos</MenuItem>
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={filtros.disciplinaId}
                onChange={(e) =>
                  setFiltros({ ...filtros, disciplinaId: e.target.value })
                }
                label="Disciplina"
              >
                <MenuItem value="">Todas</MenuItem>
                {disciplinas.map((disc) => (
                  <MenuItem key={disc._id} value={disc._id}>
                    {disc.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Professor</InputLabel>
              <Select
                value={filtros.professorId}
                onChange={(e) =>
                  setFiltros({ ...filtros, professorId: e.target.value })
                }
                label="Professor"
              >
                <MenuItem value="">Todos</MenuItem>
                {professores.map((prof) => (
                  <MenuItem key={prof._id} value={prof._id}>
                    {prof.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {(filtros.laboratorioId ||
          filtros.cursoId ||
          filtros.disciplinaId ||
          filtros.professorId) && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              component="span"
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={limparFiltros}
            >
              Limpar filtros
            </Typography>
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Semestre</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Laboratório</TableCell>
              <TableCell>Dia</TableCell>
              <TableCell>Horários</TableCell>
              <TableCell>Período</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aulas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Nenhum horário encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              aulas.map((aula) => (
                <TableRow key={aula._id}>
                  <TableCell>
                    <Chip label={aula.semestre} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    {obterNome(cursos, aula.cursoId || aula.curso)}
                  </TableCell>
                  <TableCell>
                    {obterNome(disciplinas, aula.disciplinaId || aula.disciplina)}
                  </TableCell>
                  <TableCell>
                    {obterNome(professores, aula.professorId || aula.professor)}
                  </TableCell>
                  <TableCell>
                    {obterNome(
                      laboratorios,
                      aula.laboratorioId || aula.laboratorio
                    )}
                  </TableCell>
                  <TableCell>{aula.diaSemana}</TableCell>
                  <TableCell>{obterBlocosFormatados(aula.blocos)}</TableCell>
                  <TableCell>
                    {aula.dataInicio &&
                      new Date(aula.dataInicio).toLocaleDateString()}{" "}
                    -{" "}
                    {aula.dataFim &&
                      new Date(aula.dataFim).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConsultaHorarios;
