import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Appbar,
  FAB,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Snackbar,
  Portal,
  Dialog,
  Button,
  TextInput,
  Switch,
  Text,
  Menu,
  Divider,
} from 'react-native-paper';
import { disciplinasService, cursosService, professoresService } from '../../services/api';

/**
 * Tela de gerenciamento de disciplinas
 * @component
 */
const DisciplinasScreen = ({ navigation }) => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cursoMenuVisible, setCursoMenuVisible] = useState(false);
  const [professorMenuVisible, setProfessorMenuVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    cargaHoraria: '',
    cursoId: '',
    professorId: '',
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
      mostrarSnackbar('Erro ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega a lista de cursos
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
   * Carrega a lista de professores
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
   * Atualiza a lista com pull to refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDisciplinas();
    setRefreshing(false);
  };

  /**
   * Exibe mensagem no snackbar
   * @param {string} message - Mensagem a ser exibida
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
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

    if (!formData.cargaHoraria.trim() || parseInt(formData.cargaHoraria) <= 0) {
      newErrors.cargaHoraria = 'Carga horária deve ser um número positivo';
    }

    if (!formData.cursoId) {
      newErrors.cursoId = 'Curso é obrigatório';
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
        cargaHoraria: disciplina.cargaHoraria?.toString() || '',
        cursoId: disciplina.cursoId?._id || disciplina.cursoId || '',
        professorId: disciplina.professorId?._id || disciplina.professorId || '',
        status: disciplina.status || 'Ativo',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        cargaHoraria: '',
        cursoId: '',
        professorId: '',
        status: 'Ativo',
      });
    }
    setErrors({});
    setDialogVisible(true);
  };

  /**
   * Fecha o dialog
   */
  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
    setCursoMenuVisible(false);
    setProfessorMenuVisible(false);
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
      if (error.response?.status >= 400 && error.response?.status < 500) {
        Alert.alert('Erro', 'Dados inválidos. Verifique as informações e tente novamente.');
      } else if (error.response?.status === 404) {
        Alert.alert('Erro', 'Curso ou Professor selecionado não foi encontrado.');
      } else if (error.response?.status >= 500) {
        Alert.alert('Erro', 'Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        const message = error.response?.data?.message || 'Erro ao salvar disciplina';
        mostrarSnackbar(message);
      }
    }
  };

  /**
   * Remove uma disciplina
   * @param {string} id - ID da disciplina
   */
  const removerDisciplina = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover esta disciplina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await disciplinasService.remover(id);
              mostrarSnackbar('Disciplina removida com sucesso');
              carregarDisciplinas();
            } catch (error) {
              if (error.response?.status === 404) {
                Alert.alert('Erro', 'Disciplina não encontrada');
              } else if (error.response?.status >= 500) {
                Alert.alert('Erro', 'Erro interno do servidor. Tente novamente mais tarde.');
              } else {
                const message = error.response?.data?.message || 'Erro ao remover disciplina';
                mostrarSnackbar(message);
              }
            }
          },
        },
      ]
    );
  };

  /**
   * Obtém o nome do curso selecionado
   */
  const getCursoNome = () => {
    const curso = cursos.find(c => c._id === formData.cursoId);
    return curso ? curso.nome : 'Selecionar Curso';
  };

  /**
   * Obtém o nome do professor selecionado
   */
  const getProfessorNome = () => {
    const professor = professores.find(p => p._id === formData.professorId);
    return professor ? professor.nome : 'Selecionar Professor';
  };

  /**
   * Filtra disciplinas por nome ou curso
   */
  const disciplinasFiltradas = disciplinas.filter((disciplina) =>
    disciplina.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    disciplina.cursoId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
    carregarProfessores();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Disciplinas" />
      </Appbar.Header>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Searchbar
          placeholder="Filtrar por nome da disciplina ou curso..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />

        {disciplinasFiltradas.map((disciplina) => (
          <Card key={disciplina._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{disciplina.nome}</Title>
                  <Paragraph>Carga Horária: {disciplina.cargaHoraria}h</Paragraph>
                  <Paragraph>Curso: {disciplina.cursoId?.nome || 'N/A'}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: disciplina.status === 'Ativo' ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {disciplina.status || 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(disciplina)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerDisciplina(disciplina._id)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => abrirDialog()}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                <TextInput
                  label="Nome *"
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                  mode="outlined"
                  style={{ marginBottom: 12 }}
                  error={!!errors.nome}
                />
                {errors.nome && (
                  <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 8 }}>
                    {errors.nome}
                  </Text>
                )}

                <TextInput
                  label="Carga Horária *"
                  value={formData.cargaHoraria}
                  onChangeText={(text) => setFormData({ ...formData, cargaHoraria: text })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={{ marginBottom: 12 }}
                  error={!!errors.cargaHoraria}
                />
                {errors.cargaHoraria && (
                  <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 8 }}>
                    {errors.cargaHoraria}
                  </Text>
                )}

                <Menu
                  visible={cursoMenuVisible}
                  onDismiss={() => setCursoMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setCursoMenuVisible(true)}
                      style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                      contentStyle={{ justifyContent: 'flex-start' }}
                    >
                      {getCursoNome()}
                    </Button>
                  }
                >
                  {cursos.map((curso) => (
                    <Menu.Item
                      key={curso._id}
                      onPress={() => {
                        setFormData({ ...formData, cursoId: curso._id });
                        setCursoMenuVisible(false);
                      }}
                      title={curso.nome}
                    />
                  ))}
                </Menu>
                {errors.cursoId && (
                  <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 8 }}>
                    {errors.cursoId}
                  </Text>
                )}

                <Menu
                  visible={professorMenuVisible}
                  onDismiss={() => setProfessorMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setProfessorMenuVisible(true)}
                      style={{ marginBottom: 12, justifyContent: 'flex-start' }}
                      contentStyle={{ justifyContent: 'flex-start' }}
                    >
                      {getProfessorNome()}
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setFormData({ ...formData, professorId: '' });
                      setProfessorMenuVisible(false);
                    }}
                    title="Nenhum professor"
                  />
                  <Divider />
                  {professores.map((professor) => (
                    <Menu.Item
                      key={professor._id}
                      onPress={() => {
                        setFormData({ ...formData, professorId: professor._id });
                        setProfessorMenuVisible(false);
                      }}
                      title={professor.nome}
                    />
                  ))}
                </Menu>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text>Ativo: </Text>
                  <Switch
                    value={formData.status === 'Ativo'}
                    onValueChange={(value) => setFormData({ ...formData, status: value ? 'Ativo' : 'Inativo' })}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarDisciplina} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default DisciplinasScreen;