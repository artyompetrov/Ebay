using Server.Application.Services.Measurement.MeasurementTypes;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.QuickTest;

public class QuickTestParser
{
    /// <summary>
    /// Функция парсит результат quickTest utracer
    /// </summary>
    /// <param name="quickTestOriginal">Результат quickTest</param>
    /// <param name="measurementType">Объект Me</param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public ParseAndPrettifyQuickTestResult Parse(string quickTestOriginal, MeasurementTypeBase measurementType)
    {
        if (!new[] { typeof(TriodeAnodeCurves), typeof(DoubleTriodeAnodeCurves), typeof(PentodeAnodeCurves) }.Contains(measurementType.GetType()))
        {
            throw new ArgumentException($"The type {measurementType.GetType().Name} is not supported.");
        }
        
        // todo реализовать метод и написать тесты на него в файле QuickTestParserTest.cs
        
      
        
        throw new NotImplementedException();
    }
}