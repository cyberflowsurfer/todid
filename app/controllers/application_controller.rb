class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :intercept_html_requests
  after_action  :set_csrf_cookie_for_ng


  # if someone asks for html, redirect them to the home page, we only serve json
  def intercept_html_requests
    redirect_to('/') if request.format == Mime::HTML
  end

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  # See: http://technpol.wordpress.com/2013/09/28/json-jsonp-xss-vulnerability-with-angularjs-and-rails/
  def render_safe_json(object, parameters = {})
    result = parameters.merge(content_type: 'application/json', text: ")]}',\n" + object.to_json)
    logger.debug result
    render result
  end

protected

  def verified_request?
    super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
  end

end
