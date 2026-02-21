namespace Server.Application.New.Services

open System
open System.Collections.Generic
open System.Threading.Tasks
open Server.Application.New.Abstractions
open Server.Application.New.Abstractions.Queries
open Server.Application.New.Abstractions.Repositories
open Server.Application.New.Abstractions.Services
open Server.Domain.Measurements

[<Sealed>]
type internal MeasurementService(
    productMeasurementRepository: IMeasurementRepository,
    matchedPairDifferenceRepository: IMatchedPairDifferenceRepository,
    measurementQueries: IMeasurementQueries,
    measurementFileParser: IMeasurementFileParser,
    unitOfWork: IUnitOfWork
) =
    interface IMeasurementService with
        member _.SaveMeasurement(
            measurementId,
            measurementsFile,
            productState,
            manufactureCode,
            productId,
            cancellationToken
        ) =
            task {
                let measurement =
                    ProductMeasurement.Create(
                        id = measurementId,
                        productId = productId,
                        measurements = measurementsFile,
                        manufactureCode = manufactureCode,
                        productState = productState,
                        measurementFileParser = measurementFileParser
                    )

                do! productMeasurementRepository.SaveAsync(measurement, cancellationToken)
                let! _ = unitOfWork.SaveChangesAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.UpdateMeasurementLocation(location, measurementId, cancellationToken) =
            task {
                let! productMeasurement =
                    productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken)

                if isNull productMeasurement then
                    raise (InvalidOperationException("Measurement not found."))

                productMeasurement.Location <-
                    if String.IsNullOrWhiteSpace(location) then
                        null
                    else
                        location.Trim()

                let! _ = unitOfWork.SaveChangesAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.UpdateMeasurementManufactureCode(manufactureCode, measurementId, cancellationToken) =
            task {
                let! productMeasurement =
                    productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken)

                if isNull productMeasurement then
                    raise (InvalidOperationException("Measurement not found."))

                productMeasurement.UpdateManufactureCode(manufactureCode)

                let! _ = unitOfWork.SaveChangesAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.UpdateMeasurementMatchId(matchId, measurementId, cancellationToken) =
            task {
                let! productMeasurement =
                    productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken)

                if isNull productMeasurement then
                    raise (InvalidOperationException("Measurement not found."))

                productMeasurement.MatchId <-
                    if String.IsNullOrWhiteSpace(matchId) then
                        null
                    else
                        matchId.Trim()

                let! _ = unitOfWork.SaveChangesAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.UpdateMeasurementLotId(lotId, measurementId, cancellationToken) =
            task {
                let! productMeasurement =
                    productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken)

                if isNull productMeasurement then
                    raise (InvalidOperationException("Measurement not found."))

                productMeasurement.LotId <-
                    if String.IsNullOrWhiteSpace(lotId) then
                        null
                    else
                        lotId.Trim()

                let! _ = unitOfWork.SaveChangesAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.UpdateMeasurementState(state, measurementId, cancellationToken) =
            task {
                let! productMeasurement =
                    productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken)

                if isNull productMeasurement then
                    raise (InvalidOperationException("Measurement not found."))

                productMeasurement.MeasurementState <- state

                let! _ = unitOfWork.SaveChangesAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.DeleteMeasurement(measurementId, cancellationToken) =
            task {
                use! transaction = unitOfWork.BeginTransactionAsync(cancellationToken = cancellationToken)

                let measurementIds = HashSet<string>([ measurementId ])

                do!
                    matchedPairDifferenceRepository.RemoveByMeasurementIds(
                        measurementIds,
                        cancellationToken
                    )

                do! productMeasurementRepository.RemoveAsync(measurementId, cancellationToken)

                do! transaction.CommitAsync(cancellationToken)
                return ()
            }
            :> Task

        member _.GetMeasurementInfos(
            productId,
            productState,
            measurementStates,
            cancellationToken
        ) =
            measurementQueries.GetMeasurementInfosWithSimilarMeasurements(
                productId,
                productState,
                measurementStates,
                cancellationToken
            )

        member _.GetMeasurementFile(measurementId, cancellationToken) : Task<byte[]> =
            task {
                let! zipBytes = measurementQueries.GetMeasurementInfoWithData(measurementId, cancellationToken)

                if obj.ReferenceEquals(zipBytes, null) then
                    return (null: byte[])
                else
                    let! result = measurementFileParser.ToPrettifiedZip(zipBytes.Data, cancellationToken)
                    return result
            }

        member _.GetLotIdsForProductAsync(productId, cancellationToken) =
            measurementQueries.GetLotIds(productId, cancellationToken)
