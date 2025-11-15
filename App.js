import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  ScrollView
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const getTodos = async () => {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      const data = await response.json();
      setTodos(data.todos.slice(0, 5));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4da6ff" />
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        
        {/* Checkmark circle */}
        <View 
          style={[
            styles.statusCircle, 
            { backgroundColor: item.completed ? "#4CAF50" : "transparent", borderColor: item.completed ? "#4CAF50" : "#ccc" }
          ]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>

        {/* Title */}
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.todo}</Text>
          {item.priority && <Text style={styles.priorityText}>Priority: {item.priority}</Text>}
          {item.date && <Text style={styles.dateText}>{item.date}</Text>}
        </View>

        {/* Time */}
        <Text style={styles.cardTime}>{index + 12} pm</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        
        {/* Gold/Yellow border frame */}
        <View style={styles.goldFrame}>
          
          {/* White content area */}
          <View style={styles.contentArea}>
            <Text style={styles.title}>ODOT List</Text>
            <Text style={styles.date}>4th March 2018</Text>

            {/* Form toggle */}
            <TouchableOpacity onPress={() => setShowForm(v => !v)} style={styles.formToggle}>
              <Text style={styles.formToggleText}>{showForm ? 'Close' : 'Add New Task'}</Text>
            </TouchableOpacity>

            {showForm && <NewTaskForm onAdd={task => {
              setTodos(prev => [task, ...prev]);
              setShowForm(false);
            }} />}

            <FlatList 
              data={todos}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              scrollEnabled={false}
              style={styles.listContainer}
            />
          </View>

          {/* Blue bottom section */}
          <View style={styles.blueBottom}>
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.navIcon}>
                <Text style={styles.navIconText}>≡</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navIcon}>
                <Text style={styles.navIconText}>🕐</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navIcon, styles.fabButton]}>
                <Text style={styles.fabText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navIcon}>
                <Text style={styles.navIconText}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navIcon}>
                <Text style={styles.navIconText}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

function NewTaskForm({ onAdd }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      date: '',
      priority: 'low'
    }
  });

  const onSubmit = data => {
    const newTask = {
      id: Date.now(),
      todo: data.name,
      completed: false, // default to 'to-do'
      priority: data.priority,
      date: data.date
    };
    onAdd(newTask);
    reset();
  };

  return (
    <View style={styles.formContainer}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.inputLabel}>Name</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Task name"
            />
          )}
        />

        <Text style={styles.inputLabel}>Date</Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="YYYY-MM-DD or any text"
            />
          )}
        />

        <Text style={styles.inputLabel}>Priority</Text>
        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <View style={styles.priorityRow}>
              {['low', 'medium', 'high'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityButton, value === p && styles.prioritySelected]}
                  onPress={() => onChange(p)}
                >
                  <Text style={[styles.priorityButtonText, value === p && styles.prioritySelectedText]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Add Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3B5998',
  },

  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  goldFrame: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    padding: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    overflow: 'hidden',
  },

  contentArea: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    minHeight: 400,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    color: '#000',
  },

  date: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
    fontWeight: '500',
  },

  listContainer: {
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  cardTime: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
    minWidth: 40,
    textAlign: 'right',
  },

  blueBottom: {
    backgroundColor: '#3B5998',
    borderRadius: 0,
    paddingVertical: 10,
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
  },

  navIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navIconText: {
    fontSize: 20,
    color: '#fff',
  },

  fabButton: {
    backgroundColor: '#4da6ff',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5998',
  },
  formToggle: {
    backgroundColor: '#eef6ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 10,
  },
  formToggleText: {
    color: '#0077cc',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#f7f9fc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff'
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  prioritySelected: {
    backgroundColor: '#4da6ff',
    borderColor: '#4da6ff'
  },
  priorityButtonText: {
    color: '#333',
    textTransform: 'capitalize'
  },
  prioritySelectedText: {
    color: '#fff'
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#4da6ff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  priorityText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4
  },
  dateText: {
    color: '#999',
    fontSize: 12,
    marginTop: 2
  }
});
