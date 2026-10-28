import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Field } from '../types';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import FieldFormScreen from '../screens/FieldFormScreen';
import FieldListScreen from '../screens/FieldListScreen';

export type RootStackParamList = {
  FieldList: undefined;
  FieldForm: { fieldId?: string } | undefined;
  FieldDetail: { fieldId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type ListProps = NativeStackScreenProps<RootStackParamList, 'FieldList'>;
type FormProps = NativeStackScreenProps<RootStackParamList, 'FieldForm'>;
type DetailProps = NativeStackScreenProps<RootStackParamList, 'FieldDetail'>;

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FieldList" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FieldList" component={FieldListRoute} />
        <Stack.Screen name="FieldForm" component={FieldFormRoute} />
        <Stack.Screen name="FieldDetail" component={FieldDetailRoute} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function FieldListRoute({ navigation }: ListProps) {
  return (
    <FieldListScreen
      onAdd={() => navigation.navigate('FieldForm')}
      onEdit={(field: Field) => navigation.navigate('FieldForm', { fieldId: field.id })}
      onOpen={(field: Field) => navigation.navigate('FieldDetail', { fieldId: field.id })}
    />
  );
}

function FieldFormRoute({ navigation, route }: FormProps) {
  return <FieldFormScreen fieldId={route.params?.fieldId} onBack={() => navigation.goBack()} />;
}

function FieldDetailRoute({ navigation, route }: DetailProps) {
  return <FieldDetailScreen fieldId={route.params.fieldId} onBack={() => navigation.goBack()} />;
}
