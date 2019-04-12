import $ from "./Translate"

export const success = (ctx, msg) => {
  notify(ctx, 'success', msg)
}

export const error = (ctx, msg) => {
  notify(ctx, 'error', msg)
}

export const notify = (ctx, appearance, msg) => {
  ctx.props.toastManager.add(msg, { appearance: appearance, autoDismiss: true, transitionDuration: 0 })
}

export const toggleState = (state, old) => {
  if(old) {
    return state ? $("en_US", "settings.updates.disabled") : $("en_US", "settings.updates.enabled")
  } else {
    return state ? $("en_US", "settings.updates.enabled") : $("en_US", "settings.updates.disabled")
  }
}