<?php

namespace DTB\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface; 
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);

        // add your custom field
        $builder->add('description');
        $builder->add('firstName');
        $builder->add('lastName');
        $builder->add('city');
        $builder->add('birthDate', 'birthday', array('format' => 'dd - MM - yyyy', 'widget' => 'choice', 'years' => range(date('Y'), date('Y')-70)));
        $builder->add('facebook');
        $builder->add('twitter');
        $builder->add('skype');
        
    }

    public function getName()
    {
        return 'dtb_user_registration';
    }
}
?>
