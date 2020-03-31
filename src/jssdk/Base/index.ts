import {getPaymentConfig, createOrder, finishOrder, getPaymentHistory} from './payment';
import Login from './login';
import {Api} from './api';
import Account from './account';
import {getUrlParam} from '../common/utils';
// import Mark from "Src/Base/Mark_old";

export default class Base {
  Account = Account.ins;

  Login(loginParam: LoginParam): Promise<LoginRes> {
    let promise: Promise<LoginRes>;
    if (loginParam.isFacebook) {
      // facebook 登陆
      promise = Login.instance.facebookLogin();
    } else {
      // 平台登陆
      promise = Login.instance.platformLogin(loginParam);
    }
    return promise;
  }

  BindZone(BindZoneParam: BindZoneParam) {
    return Api.instance.Bind(BindZoneParam);
  }

  Redirect() {
    window.name = 'redirect';
    location.reload();
  }

  CurUserInfo = (): JSSDK.CurUserInfo => {
    return RG.jssdk.Account.user || getUrlParam('user');
  };

  Share(shareUrl: string) {
    console.info('facebook share' + shareUrl);
    return new Promise((resolve, reject) => {
      FB.ui(
        {
          method: 'share',
          href: shareUrl,
          display: 'popup'
        },
        function(shareDialogResponse) {
          if (shareDialogResponse) {
            if (shareDialogResponse.error_message) {
              resolve({
                code: 0,
                error_msg: shareDialogResponse.error_message
              });
            } else {
              resolve({
                code: 200
              });
            }
          } else {
            resolve({
              code: 0
            });
          }
        }
      );
    });
  }

  Messenger() {
    window.open(RG.jssdk.config.page.facebook.index);
  }

  static paymentConfig: PaymentConfig;
  PaymentConfig(PaymentConfig: PaymentConfig): Promise<PaymentConfigRes> {
    Base.paymentConfig = PaymentConfig;
    return getPaymentConfig(PaymentConfig);
  }

  Ordering(OrderingData: PaymentChannel) {
    return createOrder(Base.paymentConfig, {
      channel: OrderingData.channel,
      code: OrderingData.code,
      amount: OrderingData.selectedProduct.amount + '',
      currency: OrderingData.selectedProduct.currency,
      productName: OrderingData.selectedProduct.productName,
      itemType: OrderingData.selectedProduct.itemType,
      isOfficial: OrderingData.isOfficial,
      exInfo: OrderingData.exInfo
    });
  }

  ChangeAccount = function() {
    return new Promise(function(resolve) {
      resolve();
    });
  };

  FinishOrder(finishOrderParams: FinishOrderParams): Promise<ServerRes> {
    return finishOrder({
      transactionId: finishOrderParams.transactionId,
      channel: finishOrderParams.channel,
      receipt: finishOrderParams.receipt,
      signature: finishOrderParams.signature,
      exInfo: finishOrderParams.exInfo
    });
  }

  GetPaymentHistory() {
    return getPaymentHistory();
  }

  ChangePassword(oldpass, newpass) {
    return Account.ins.changePass(oldpass, newpass);
  }

  VisitorUpgrade(account: string, pass: string) {
    return Api.instance.BindVisitor(account, pass);
  }
}
