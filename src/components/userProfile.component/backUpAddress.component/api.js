import { apiClient as clientApi } from "../../../api";
import { ApiControllers } from "../../../api/config";
const getBackupCryptoAddressLu = (network) => {
  return clientApi.get(ApiControllers.addressbook + `CryptoBackupAddressLU/${network}`)
}
const getFiatBackupAddressLU = (walletCode) => {
    return clientApi.get(ApiControllers.addressbook + `FiatBackupAddressLU/${walletCode}`)
  }

  const saveBackupAddresses = (obj) => {
    return clientApi.post(ApiControllers.addressbook + `BackupAddress`,obj)
  }
  const getBackupAddress = () => {
    return clientApi.get(ApiControllers.addressbook + `BackupAddress`)
  }
export {
    getBackupCryptoAddressLu,getFiatBackupAddressLU,saveBackupAddresses,getBackupAddress
};
