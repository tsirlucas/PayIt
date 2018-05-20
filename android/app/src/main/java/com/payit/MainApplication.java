package com.payit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.beefe.picker.PickerViewPackage;
import io.sentry.RNSentryPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import im.shimo.react.prompt.RNPromptPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.wheelpicker.WheelPickerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNSentryPackage(MainApplication.this),
          new VectorIconsPackage(),
          new SplashScreenReactPackage(),
          new PickerViewPackage(),
          new RNPromptPackage(),
          new RNI18nPackage(),
          new WheelPickerPackage(),
          new ReactNativeConfigPackage(),
          new RNGoogleSigninPackage(),
          new RNFirebasePackage(),
          new RNFirebaseAuthPackage(),
          new RNFirebaseFirestorePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
