import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Snackbar,
  Searchbar,
  Chip,
  Menu,
  Divider,
  IconButton,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { aulasService, cursosService, disciplinasService, professoresService } from '../../services/api';
import laboratorioService from '../../services/laboratorioService';
import blocoService from '../../services/blocoService';

/**
 * Tela de gerenciamento de aulas
 * @component
 */
const AulasScreen = ({ navigation }) => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroLaboratorio, setFiltroLaboratorio] = useState('');
  const [filtroProfessor, setFiltroProfessor] = useState('');
  const [filtroDiaSemana, setFiltroDiaSemana] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState({ show: false, field: '' });
  const [showBlocosModal, setShowBlocosModal] = useState(false);

  const [aulaAtual, setAulaAtual] = useState({
    semestre: '',
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    laboratorioId: '',
    diaSemana: '',
    blocos: [],
    dataInicio: new Date(),
    dataFim: new Date(),
  });

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

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
      setLoading(true);
      const [aulasRes, cursosRes, disciplinasRes, professoresRes, laboratoriosRes, blocosRes] = await Promise.all([
        aulasService.listar(),
        cursosService.listar(),
        disciplinasService.listar(),
        professoresService.listar(),
        laboratorioService.getAll(),
        blocoService.getAll(),
      ]);

      setAulas(aulasRes.data.data || []);
      setCursos(cursosRes.data.data || []);
      setDisciplinas(disciplinasRes.data.data || []);
      setProfessores(professoresRes.data.data || []);
      setLaboratorios(laboratoriosRes.data || []);
      setBlocos(blocosRes.data || []);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza lista com pull to refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  /**
   * Filtra aulas baseado nos critérios
   */
  const aulasFiltradas = aulas.filter(aula => {
    const disciplina = disciplinas.find(d => d._id === aula.disciplinaId);
    const matchSearch = !searchQuery || 
      (disciplina?.nome?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      aula.semestre.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchLaboratorio = !filtroLaboratorio || aula.laboratorioId === filtroLaboratorio;
    const matchProfessor = !filtroProfessor || aula.professorId === filtroProfessor;
    const matchDiaSemana = !filtroDiaSemana || aula.diaSemana === filtroDiaSemana;
    
    return matchSearch && matchLaboratorio && matchProfessor && matchDiaSemana;
  });

  /**
   * Abre modal para nova aula
   */
  const handleNovo = () => {
    setAulaAtual({
      semestre: '',
      cursoId: '',
      disciplinaId: '',
      professorId: '',
      laboratorioId: '',
      diaSemana: '',
      blocos: [],
      dataInicio: new Date(),
      dataFim: new Date(),
    });
    setEditando(false);
    setModalVisible(true);
  };

  /**
   * Abre modal para editar aula
   */
  const handleEditar = (aula) => {
    setAulaAtual({
      ...aula,
      dataInicio: new Date(aula.dataInicio),
      dataFim: new Date(aula.dataFim),
    });
    setEditando(true);
    setModalVisible(true);
  };

  /**
   * Remove uma aula
   */
  const handleRemover = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja remover esta aula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await aulasService.remover(id);
              carregarDados();
              mostrarSnackbar('Aula removida com sucesso!');
            } catch (error) {
              mostrarSnackbar('Erro ao remover aula');
            }
          },
        },
      ]
    );
  };

  /**
   * Salva aula (criar ou atualizar)
   */
  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    try {
      const dadosAula = {
        ...aulaAtual,
        dataInicio: aulaAtual.dataInicio.toISOString(),
        dataFim: aulaAtual.dataFim.toISOString(),
      };

      if (editando) {
        await aulasService.atualizar(aulaAtual._id, dadosAula);
        mostrarSnackbar('Aula atualizada com sucesso!');
      } else {
        await aulasService.criar(dadosAula);
        mostrarSnackbar('Aula criada com sucesso!');
      }
      setModalVisible(false);
      carregarDados();
    } catch (error) {
      if (error.response?.status === 409) {
        mostrarSnackbar('Conflito de Agendamento: Professor ou Laboratório já ocupados no horário.');
      } else {
        mostrarSnackbar('Erro ao salvar aula');
      }
    }
  };

  /**
   * Valida formulário
   */
  const validarFormulario = () => {
    if (!aulaAtual.semestre) {
      mostrarSnackbar('Semestre é obrigatório');
      return false;
    }
    if (!aulaAtual.cursoId) {
      mostrarSnackbar('Curso é obrigatório');
      return false;
    }
    if (!aulaAtual.disciplinaId) {
      mostrarSnackbar('Disciplina é obrigatória');
      return false;
    }
    if (!aulaAtual.professorId) {
      mostrarSnackbar('Professor é obrigatório');
      return false;
    }
    if (!aulaAtual.laboratorioId) {
      mostrarSnackbar('Laboratório é obrigatório');
      return false;
    }
    if (!aulaAtual.diaSemana) {
      mostrarSnackbar('Dia da semana é obrigatório');
      return false;
    }
    if (!aulaAtual.blocos.length) {
      mostrarSnackbar('Pelo menos um bloco deve ser selecionado');
      return false;
    }
    if (aulaAtual.dataInicio >= aulaAtual.dataFim) {
      mostrarSnackbar('Data de fim deve ser posterior à data de início');
      return false;
    }
    return true;
  };

  /**
   * Mostra snackbar com mensagem
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Obtém nome da entidade por ID
   */
  const obterNome = (lista, id, campo = 'nome') => {
    const item = lista.find(item => item._id === id);
    return item ? item[campo] : 'N/A';
  };

  /**
   * Manipula seleção de data
   */
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker({ show: false, field: '' });
    if (selectedDate) {
      setAulaAtual({
        ...aulaAtual,
        [showDatePicker.field]: selectedDate,
      });
    }
  };

  /**
   * Toggle seleção de bloco
   */
  const toggleBloco = (blocoId) => {
    const blocosSelecionados = [...aulaAtual.blocos];
    const index = blocosSelecionados.indexOf(blocoId);
    
    if (index > -1) {
      blocosSelecionados.splice(index, 1);
    } else {
      blocosSelecionados.push(blocoId);
    }
    
    setAulaAtual({ ...aulaAtual, blocos: blocosSelecionados });
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Aulas / Agendamentos" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Buscar por disciplina ou semestre"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />

        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Picker
              selectedValue={filtroProfessor}
              onValueChange={setFiltroProfessor}
              style={{ height: 50 }}
            >
              <Picker.Item label="Todos os Professores" value="" />
              {professores.map(professor => (
                <Picker.Item key={professor._id} label={professor.nome} value={professor._id} />
              ))}
            </Picker>
          </View>
          
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Picker
              selectedValue={filtroLaboratorio}
              onValueChange={setFiltroLaboratorio}
              style={{ height: 50 }}
            >
              <Picker.Item label="Todos os Laboratórios" value="" />
              {laboratorios.map(laboratorio => (
                <Picker.Item key={laboratorio._id} label={laboratorio.nome} value={laboratorio._id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Picker
            selectedValue={filtroDiaSemana}
            onValueChange={setFiltroDiaSemana}
            style={{ height: 50 }}
          >
            <Picker.Item label="Todos os Dias" value="" />
            {diasSemana.map(dia => (
              <Picker.Item key={dia} label={dia} value={dia} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {aulasFiltradas.map((aula) => (
          <Card key={aula._id} style={{ marginBottom: 16 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{aula.semestre}</Title>
                  <Paragraph>Disciplina: {obterNome(disciplinas, aula.disciplinaId)}</Paragraph>
                  <Paragraph>Professor: {obterNome(professores, aula.professorId)}</Paragraph>
                  <Paragraph>Laboratório: {obterNome(laboratorios, aula.laboratorioId)}</Paragraph>
                  <Paragraph>Dia: {aula.diaSemana}</Paragraph>
                  <Paragraph>
                    Período: {new Date(aula.dataInicio).toLocaleDateString()} - {new Date(aula.dataFim).toLocaleDateString()}
                  </Paragraph>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton icon="pencil" onPress={() => handleEditar(aula)} />
                  <IconButton icon="delete" onPress={() => handleRemover(aula._id)} />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
        icon="plus"
        onPress={handleNovo}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 8,
            maxHeight: '90%',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView>
              <Title>{editando ? 'Editar Aula' : 'Nova Aula'}</Title>

              <TextInput
                label="Semestre"
                value={aulaAtual.semestre}
                onChangeText={(text) => setAulaAtual({ ...aulaAtual, semestre: text })}
                style={{ marginBottom: 16 }}
                placeholder="Ex: 2024.2"
              />

              <View style={{ marginBottom: 16 }}>
                <Paragraph>Curso:</Paragraph>
                <Picker
                  selectedValue={aulaAtual.cursoId}
                  onValueChange={(value) => setAulaAtual({ ...aulaAtual, cursoId: value })}
                >
                  <Picker.Item label="Selecione um curso" value="" />
                  {cursos.map(curso => (
                    <Picker.Item key={curso._id} label={curso.nome} value={curso._id} />
                  ))}
                </Picker>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Paragraph>Disciplina:</Paragraph>
                <Picker
                  selectedValue={aulaAtual.disciplinaId}
                  onValueChange={(value) => setAulaAtual({ ...aulaAtual, disciplinaId: value })}
                >
                  <Picker.Item label="Selecione uma disciplina" value="" />
                  {disciplinas.map(disciplina => (
                    <Picker.Item key={disciplina._id} label={disciplina.nome} value={disciplina._id} />
                  ))}
                </Picker>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Paragraph>Professor:</Paragraph>
                <Picker
                  selectedValue={aulaAtual.professorId}
                  onValueChange={(value) => setAulaAtual({ ...aulaAtual, professorId: value })}
                >
                  <Picker.Item label="Selecione um professor" value="" />
                  {professores.map(professor => (
                    <Picker.Item key={professor._id} label={professor.nome} value={professor._id} />
                  ))}
                </Picker>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Paragraph>Laboratório:</Paragraph>
                <Picker
                  selectedValue={aulaAtual.laboratorioId}
                  onValueChange={(value) => setAulaAtual({ ...aulaAtual, laboratorioId: value })}
                >
                  <Picker.Item label="Selecione um laboratório" value="" />
                  {laboratorios.map(laboratorio => (
                    <Picker.Item key={laboratorio._id} label={laboratorio.nome} value={laboratorio._id} />
                  ))}
                </Picker>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Paragraph>Dia da Semana:</Paragraph>
                <Picker
                  selectedValue={aulaAtual.diaSemana}
                  onValueChange={(value) => setAulaAtual({ ...aulaAtual, diaSemana: value })}
                >
                  <Picker.Item label="Selecione um dia" value="" />
                  {diasSemana.map(dia => (
                    <Picker.Item key={dia} label={dia} value={dia} />
                  ))}
                </Picker>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Button onPress={() => setShowBlocosModal(true)}>
                  Selecionar Blocos ({aulaAtual.blocos.length} selecionados)
                </Button>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                  {aulaAtual.blocos.map(blocoId => {
                    const bloco = blocos.find(b => b._id === blocoId);
                    return bloco ? (
                      <Chip key={blocoId} style={{ margin: 2 }}>
                        {bloco.turno} ({bloco.inicio}-{bloco.fim})
                      </Chip>
                    ) : null;
                  })}
                </View>
              </View>

              <Button
                onPress={() => setShowDatePicker({ show: true, field: 'dataInicio' })}
                style={{ marginBottom: 16 }}
              >
                Data Início: {aulaAtual.dataInicio.toLocaleDateString()}
              </Button>

              <Button
                onPress={() => setShowDatePicker({ show: true, field: 'dataFim' })}
                style={{ marginBottom: 16 }}
              >
                Data Fim: {aulaAtual.dataFim.toLocaleDateString()}
              </Button>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
                <Button mode="contained" onPress={handleSalvar}>
                  {editando ? 'Atualizar' : 'Criar'}
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          visible={showBlocosModal}
          onDismiss={() => setShowBlocosModal(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 8,
            maxHeight: '80%',
          }}
        >
          <Title>Selecionar Blocos</Title>
          <ScrollView>
            {blocos.map(bloco => (
              <View key={bloco._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Button
                  mode={aulaAtual.blocos.includes(bloco._id) ? 'contained' : 'outlined'}
                  onPress={() => toggleBloco(bloco._id)}
                  style={{ flex: 1 }}
                >
                  {bloco.turno} - {bloco.diaSemana} ({bloco.inicio}-{bloco.fim})
                </Button>
              </View>
            ))}
          </ScrollView>
          <Button onPress={() => setShowBlocosModal(false)} style={{ marginTop: 16 }}>
            Fechar
          </Button>
        </Modal>
      </Portal>

      {showDatePicker.show && (
        <DateTimePicker
          value={aulaAtual[showDatePicker.field]}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default AulasScreen;