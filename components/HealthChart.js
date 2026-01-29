import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

export default function HealthChart({ data, title, color, unit }) {
  // Processar dados para o gráfico
  const chartData = {
    labels: data.slice(-8).map(item => {
      const date = new Date(item.data);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        data: data.slice(-8).map(item => {
          // Extrair valor numérico
          const valor = item.valor;
          if (typeof valor === 'string') {
            // Remover unidades e converter para número
            const numValue = parseFloat(valor.replace(/[^\d.-]/g, ''));
            return isNaN(numValue) ? 0 : numValue;
          }
          return valor || 0;
        }),
        color: (opacity = 1) => color,
        strokeWidth: 3,
      },
    ],
  };

  // Configuração moderna do gráfico
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f8fafc',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 20,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: color,
      fill: color,
    },
    propsForBackgroundLines: {
      strokeDasharray: '5, 5',
      stroke: '#e2e8f0',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 10,
      fontWeight: '500',
    },
  };

  if (data.length === 0) {
    return (
      <View style={{
        backgroundColor: '#f8fafc',
        padding: 24,
        borderRadius: 20,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed'
      }}>
        <Text style={{ 
          fontSize: 14, 
          color: '#64748b', 
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Sem dados disponíveis para o gráfico
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9'
      }}>
        {/* Header do gráfico */}
        <View style={{
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: 8,
          }}>
            {title}
          </Text>
          <View style={{
            backgroundColor: `${color}15`,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: `${color}30`,
            alignSelf: 'flex-start',
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: color,
            }}>
              Últimas medições
            </Text>
          </View>
        </View>
        
        {/* Gráfico */}
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={200}
          chartConfig={chartConfig}
          bezier
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        
        {/* Footer info */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9'
        }}>
          <Text style={{
            fontSize: 12,
            color: '#64748b',
            fontWeight: '500',
          }}>
            Unidade: {unit}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: color,
              marginRight: 6,
            }} />
            <Text style={{
              fontSize: 11,
              color: '#64748b',
              fontWeight: '500',
            }}>
              Tempo real
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
