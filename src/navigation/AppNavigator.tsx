import React, { useState } from 'react';
import { useFields } from '../hooks/useFields';
import { BackHandler } from 'react-native';
import type { Field } from '../types';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import FieldFormScreen from '../screens/FieldFormScreen';
import FieldListScreen from '../screens/FieldListScreen';

type Screen = { name: 'list' } | { name: 'form'; field?: Field } | { name: 'detail'; fieldId: string };

export default function AppNavigator() {
  const [screen, setScreen] = useState<Screen>({ name: 'list' });
  const back = () => setScreen({ name: 'list' });
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen.name === 'list') return false;
      back();
      return true;
    });
    return () => subscription.remove();
  }, [screen]);

  if (screen.name === 'form') return <FieldFormScreen field={screen.field} onBack={back} />;
  if (screen.name === 'detail') {
    return <DetailById fieldId={screen.fieldId} onBack={back} />;
  }
  return <FieldListScreen onAdd={() => setScreen({ name: 'form' })} onEdit={field => setScreen({ name: 'form', field })} onOpen={field => setScreen({ name: 'detail', fieldId: field.id })} />;
}

function DetailById({ fieldId, onBack }: { fieldId: string; onBack: () => void }) {
  const { getFieldById } = useFields();
  return <FieldDetailScreen field={getFieldById(fieldId)} onBack={onBack} />;
}
